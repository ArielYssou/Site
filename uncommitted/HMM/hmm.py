import numpy as np
import matplotlib.pyplot as plt
from numpy.random import dirichlet

class HMM(object):
    '''
    Implements the hidden markov model

    Parameters:
        iters: Number of iterations
        n_states: number of possible states
        n_obs: Number of possible observations
    '''
    def __init__(self, iters = 1000, n_states = 2, n_obs = 3, precision = 0.1):
        self.iters = iters
        self.n_states = n_states
        self.n_obs = n_obs
        self.precision = precision

        self.best_prob = -np.inf
        self.no_improv_steps = 0
        self.observations = []
        self.T = 0

        self.A = []
        self.B = []
        self.pi = []
        self.alphas = []
        self.betas = []
        self.gammas = []
        self.digammas = []
        self.scale = []

    def initialize(self, T, A = [], B = [], pi = []):
        self.T = T

        self.alphas = np.zeros((self.T , self.n_states))
        self.betas = np.zeros((self.T, self.n_states))
        self.gammas = np.zeros((self.T, self.n_states))
        self.digammas = np.zeros((self.T, self.n_states, self.n_states))
        self.scale = np.zeros((self.T))

        # Initialize transition matrices
        if A:
            self.A = A
        else:
            self.A = dirichlet(
                    np.ones(self.n_states) * self.n_states,
                    size = self.n_states,
                    )
        if B:
            self.B = B
        else:
            self.B = dirichlet(
                    np.ones(self.n_obs) * self.n_obs,
                    size = self.n_states,
                    )
        if pi:
            self.pi = pi
        else:
            self.pi = dirichlet(
                    np.ones(self.n_states) * self.n_states,
                    size = 1
                    )

    def alpha_pass(self):
        ## Initialization step
        self.scale[0] = 0
        for i in range(self.n_states):
            self.alphas[0][i] = self.pi[0][i] * self.B[i][self.observations[0]]
            self.scale[0] += self.alphas[0][i]
        # Scaling
        self.scale[0] = 1 / self.scale[0]
        self.alphas[0] *= self.scale[0]

        ## Foward propagation step
        for t in range(1, self.T):
            self.scale[t] = 0
            for i in range(self.n_states):
                self.alphas[t][i] = 0
                for j in range(self.n_states):
                    self.alphas[t][i] += self.alphas[t - 1][j] * self.A[j][i]
                self.alphas[t][i] *= self.B[i][self.observations[t]]
                self.scale[t] += self.alphas[t][i]

            # Scale alpha_t(i)
            self.scale[t] = 1 / self.scale[t]
            self.alphas[t] *= self.scale[t]

    def beta_pass(self):
        ## Initialization step
        for i in range(self.n_states):
            self.betas[self.T - 1][i] = 1 * self.scale[self.T - 1]

        for t in range(self.T - 2, -1, -1):
            for i in range(self.n_states):
                self.betas[t][i] = 0
                for j in range(self.n_states):
                    self.betas[t][i] += self.A[i][j] * self.B[j][self.observations[t+1]] * self.betas[t+1][j]
                self.betas[t][i] *= self.scale[t]

    def estimate_gammas(self):
        # Estimate gammas and digammas. As alphas and betas are scaled there is no need to sacle the gammas
        for t in range(self.T - 1):
            for i in range(self.n_states):
                self.gammas[t][i] = 0
                for j in range(self.n_states):
                    self.digammas[t][i][j] = self.alphas[t][i] * self.A[i][j]  * self.B[j][self.observations[t+1]] * self.betas[t+1][j]
                    self.gammas[t][i] += self.digammas[t][i][j]
        # Special case for the last element
        for i in range(self.n_states):
            self.gammas[self.T - 1][i] = self.alphas[self.T - 1][i]

    def reestimate(self):
        # Reestimate the initial state:
        for i in range(self.n_states):
            self.pi[0][i] = self.gammas[0][i]

        # Reestimate the state trasition matrix A:
        for i in range(self.n_states):
            denom = 0
            for t in range(self.T - 1):
                denom += self.gammas[t][i]

            for j in range(self.n_states):
                numer = 0
                for t in range(self.T - 1):
                    numer += self.digammas[t][i][j]
                self.A[i][j] = numer / denom
        
        # Reestimate the observation transition matrix B
        for i in range(self.n_states):
            denom = 0
            for t in range(self.T):
                denom += self.gammas[t][i]
            for j in range(self.n_obs):
                numer = 0
                for t in range(self.T):
                    if self.observations[t] == j:
                        numer += self.gammas[t][i]
                self.B[i][j] = numer / denom

    def log_ods(self):
        log_prob = 0
        for i in range(self.T):
            log_prob += np.log(self.scale[i])
        return -log_prob

    def fit(self, observations):
        self.observations = observations
        if self.n_obs < len(set(observations)):
            print(f'Invalid number of possible observations. Model has {self.n_obs} and the are {len(set(observations))} in the sequence')
        
        self._historic = []
        self.initialize(T = len(observations))

        for step in range(self.iters):
            self.alpha_pass()
            self.beta_pass()
            self.estimate_gammas()
            self.reestimate()
            prob = self.log_ods()
            self._historic.append(prob)

            if prob >= self.best_prob:
                self.best_prob = prob
            else:
                #if abs(prob - self.best_prob) < self.precision:
                break

        plt.plot(range(len(self._historic)), self._historic)
        plt.show()

    def generate_sequece(self):
        '''
        Returns a sequence of observations
        '''
        possible_states = list(range(len(self.A[0])))
        possible_observations = list(range(len(self.B[0])))

        states = [np.random.choice(possible_states, p = self.pi[0])]
        observations = [np.random.choice(possible_observations, p = self.B[states[0]]) ]
        for _ in range(self.T):
            states.append(np.random.choice(possible_states, p = self.A[states[-1]]))
            observations.append(np.random.choice(possible_observations, p = self.B[states[-1]]))

        return observations, states

    def p_obs(self, observations):
        '''
        Implements log(P(observationservation | model))

        Input:
            observations: observationservation sequence
        '''
        return -sum([np.log(c) for c in self.scale])

    def relative_distance(self, other_hmm, observations, symetric = True):
        '''DOCSTRING'''
        # Reestimate alphas to obtain P(O | model) for each model
        if sum(self.alphas.flatten()) == 0:
            self.observations = observations
            self.alpha_pass() 
        if sum(other_hmm.alphas.flatten()) == 0:
            other_hmm.observations = observations
            other_hmm.alpha_pass()

        d1 = (self.p_obs(observations) - other_hmm.p_obs(observations)) / self.T
        if symetric:
            d2 = other_hmm.relative_distance(
                    self,
                    observations,
                    symetric = False
                    )
            d1 = (d1 + d2) / 2
        return d1


if __name__ == '__main__':
    T = 10
    A_true = [[0.7, 0.3], [0.4, 0.6]] 
    B_true = [[0.1, 0.4, 0.5], [0.7, 0.2, 0.1]] 
    pi_true = [[0.7, 0.3]]

    hmm_true = HMM()
    hmm_true.initialize(T, A_true, B_true, pi_true)
    observations, state = hmm_true.generate_sequece()

    hmm = HMM()
    hmm.fit(observations)
    print(f'Distance between trained and true: {hmm.relative_distance(hmm_true, observations)}')

    hmm_random = HMM()
    hmm_random.initialize(T)
    print(f'Distance between true and random: {hmm_true.relative_distance(hmm_random, observations)}')
    print(f'Distance between trained and random: {hmm.relative_distance(hmm_random, observations)}')
    print(
            -sum([np.log(c) for c in hmm_random.scale])  + 
            sum([np.log(c) for c in hmm_true.scale])
                )

