import numpy as np
import matplotlib.pyplot as plt
from numpy.random import dirichlet

def hmm_sequence(length, A, B, pi):
    '''
    Returns a sequence of observations, states froma  given HMM model \lambda(A, B, pi).

    Input:
        length: Temporal length of the observation sequence
        A: State transition matrix
        B: Observation probability matrix. Each column represents a state and each line holds the probability of observation given that state.
        pi: Initial state probabilities.
    '''
    possible_states = list(range(len(A[0])))
    possible_observations = list(range(len(B[0])))

    states = [np.random.choice(possible_states, p = pi)]
    observations = [np.random.choice(possible_observations, p = B[states[0]]) ]
    for _ in range(length):
        states.append(np.random.choice(possible_states, p = A[states[-1]]))
        observations.append(np.random.choice(possible_observations, p = B[states[-1]]))
    return observations, states

class HMM(object):
    '''
    Implements the hidden markov model

    Parameters:
        iters: Number of iterations
        n_states: number of possible states
        n_obs: Number of possible observations
    '''
    def __init__(self, iters = 1000, n_states = 2, n_obs = 3, persistance = 5):
        self.iters = iters
        self.n_states = n_states
        self.n_obs = n_obs
        self.persistance = persistance

        self.best_prob = -np.inf
        self.no_improv_steps = 0
        self.Obs = []
        self.time = 0

    def initialize(self, Obs):
        self.time = len(self.Obs)

        self.alphas = np.zeros((self.time , self.n_states))
        self.betas = np.zeros((self.time, self.n_states))
        self.gammas = np.zeros((self.time, self.n_states))
        self.digammas = np.zeros((self.time, self.n_states, self.n_states))
        self.scale = np.zeros((self.time))

        # Initialize transition matrices
        self.A = dirichlet(
                np.ones(self.n_states) * self.n_states,
                size = self.n_states,
                )
        self.B = dirichlet(
                np.ones(self.n_obs) * self.n_obs,
                size = self.n_states,
                )
        self.initial_state = dirichlet(
                np.ones(self.n_states) * self.n_states,
                size = 1
                )

    def alpha_pass(self):
        ## Initialization step
        self.scale[0] = 0
        for i in range(self.n_states):
            self.alphas[0][i] = self.initial_state[0][i] * self.B[i][self.Obs[0]]
            self.scale[0] += self.alphas[0][i]
        # Scaling
        self.scale[0] = 1 / self.scale[0]
        self.alphas[0] *= self.scale[0]

        ## Foward propagation step
        for t in range(1, self.time):
            self.scale[t] = 0
            for i in range(self.n_states):
                self.alphas[t][i] = 0
                for j in range(self.n_states):
                    self.alphas[t][i] += self.alphas[t - 1][j] * self.A[i][j]
                self.alphas[t][i] *= self.B[i][self.Obs[t]]
                self.scale[t] += self.alphas[t][i]

            # Scale alpha_t(i)
            self.scale[t] = 1 / self.scale[t]
            self.alphas[t] *= self.scale[t]

    def beta_pass(self):
        ## Initialization step
        for i in range(self.n_states):
            self.betas[self.time - 1][i] = 1 * self.scale[self.time - 1]
        for t in range(self.time - 2, -1, -1):
            for i in range(self.n_states):
                self.betas[t][i] = 0
                for j in range(self.n_states):
                    self.betas[t][i] += self.A[i][j] * self.B[j][self.Obs[t+1]] * self.betas[t+1][j]
                self.betas[t][i] *= self.scale[t]

    def estimate_gammas(self):
        # Estimate gammas and digammas. As alphas and betas are scaled there is no need to sacle the gammas
        for t in range(self.time - 1):
            for i in range(self.n_states):
                self.gammas[t][i] = 0
                for j in range(self.n_states):
                    self.digammas[t][i][j] = self.alphas[t][i] * self.A[i][j]  * self.B[j][self.Obs[t+1]] * self.betas[t+1][j]
                    self.gammas[t][i] += self.digammas[t][i][j]
        # Special case for the last element
        for i in range(self.n_states):
            self.gammas[self.time - 1][i] = self.alphas[self.time - 1][i]

    def reestimate(self):
        # Reestimate the initial state:
        for i in range(self.n_states):
            self.initial_state[0][i] = self.gammas[0][i]

        # Reestimate the state trasition matrix A:
        for i in range(self.n_states):
            denom = 0
            for t in range(self.time):
                denom += self.gammas[t][i]
            for j in range(self.n_states):
                numer = 0
                for t in range(self.time - 1):
                    numer += self.digammas[t][i][j]
                self.A[i][j] = numer / denom
        
        # Reestimate the observation transition matrix B
        for i in range(self.n_states):
            denom = 0
            for t in range(self.time - 1):
                denom += self.gammas[t][i]
            for j in range(self.n_obs):
                numer = 0
                for t in range(self.time - 1):
                    if self.Obs[t] == j:
                        numer += self.gammas[t][i]
                self.B[i][j] = numer / denom

    def log_ods(self):
        log_prob = 0
        for i in range(self.time):
            log_prob += np.log(self.scale[i])
        return -log_prob

    def fit(self, Obs):
        self.Obs = Obs
        if self.n_obs < len(set(Obs)):
            print(f'Invalid number of possible observations. Model has {self.n_obs} and the are {len(set(Obs))} in the sequence')
        
        self._historic = []
        self.initialize(Obs)
        for step in range(self.iters):
            self.alpha_pass()
            self.beta_pass()
            self.estimate_gammas()
            self.reestimate()
            prob = self.log_ods()
            self._historic.append(prob)

            if prob >= self.best_prob:
                self.best_prob = prob
                self.no_improv_steps = 0
            else:
                self.no_improv_steps += 1
                if self.no_improv_steps >= self.persistance:
                    break

        print('-' * 70)
        print('A')
        for line in range(len(self.A)):
            print(sum(self.A[line]))
        print('-' * 70)
        print('B')
        for line in range(len(self.B)):
            print(sum(self.B[line]))
        
        print(self.initial_state)
        print('-' * 70)
        print('-' * 70)
        print(f'step: {step - 1}')

        plt.plot(range(len(self._historic)), self._historic)
        plt.show()

    def prob_obs(self, Obs)

if __name__ == '__main__':
    hmm = HMM(persistance = 0)
    observations, states = hmm_sequence(
            10,
            [[0.7, 0.3], [0.4, 0.6]],
            [[0.1, 0.4, 0.5], [0.7, 0.2, 0.1]],
            [0.7, 0.3]
            )

    hmm.fit(observations)
    print(hmm.A)
    print('-' * 70)
    print(hmm.B)
