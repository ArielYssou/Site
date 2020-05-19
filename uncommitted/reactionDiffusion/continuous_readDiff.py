import numpy as np
import matplotlib.pyplot as plt
from scipy.sparse import dia_matrix
from numpy.random import random
from matplotlib.colors import LightSource, ListedColormap

class Simulation(object):
    def __init__(self, size, iters, Da, Db, f, k):
        self.size = size # Size of the grid 
        self.iters = iters # Max iterations
        self.Da = Da # A substance diffusion
        self.Db = Db # B substance diffusion

        # Feed rate matrix
        self.f = [np.linspace(f[0], f[-1], size) for line in range(size)]
        self.f = np.asarray(self.f)
        
        # Kill rate matrix
        self.k = [np.linspace(k[0], k[-1], size) for line in range(size)]
        self.k = np.asarray(self.k).transpose()

        self.A = np.ones((self.size, self.size))
        self.B = np.zeros((self.size, self.size))

        # Build the discrete laplacian operator useing the 5 point stencil
        n = self.size # For readability
        main = np.ones(n ** 2)
        inf = ( [1] * (n - 1) + [0] ) * n
        sup = ( [0] + [1] * (n - 1) ) * n

        diags = [-4*main, inf, sup, main, main]
        offsets = [0, -1, 1, -n, n]

        self.Laplacian = dia_matrix((diags, offsets), shape=(n**2, n**2) )

    def initial_conditions(self):
        '''
        Sets the initial conditions
        '''

        #self.A += 0.02 * random( (self.size, self.size) )
        #self.B += 0.02 * random( (self.size, self.size) )

        r = 10 # radius
        mid = int(self.size / 2)
        #self.A[mid-r:mid+r, mid-r:mid+r] = 0.50
        self.B[mid-r:mid+r, mid-r:mid+r] = 1
        return 
    
    def show(self):
        '''
        Plots the final B concentratio
        '''

        # Custom color map contruction
        N = 256
        vals = np.ones((N, 4))
        vals[:, 0] = np.linspace(252/256, 52/256, N)
        vals[:, 1] = np.linspace(116/256, 52/256, N)
        vals[:, 2] = np.linspace(20/256, 52/256, N)
        newcmp = ListedColormap(vals)

        plt.imshow(self.A.tolist(), cmap=newcmp)
        plt.show()

    def fancy_show(self):
        ax.set_axis_off()

        z = self.A
        ls = LightSource(azdeg=315, altdeg=45)
        rgb = ls.shade(
                z,
                cmap=plt.cm.copper,
                vert_exag=z.max(),
                blend_mode='hsv'
                )

        plt.imshow(rgb)
        plt.show()


    def run(self):
        A = self.A.reshape((self.size * self.size))
        B = self.B.reshape((self.size * self.size))
        L = self.Laplacian
        f = self.f.reshape((self.size * self.size))
        k = self.k.reshape((self.size * self.size))

        for _ in range(self.iters):
            try:
                ABB = A*B*B # To avoid doing the operation twice
            except RuntimeWarning:
                break
            A += Da * L.dot(A) - ABB + np.multiply(f, (1 - A))
            B += Db * L.dot(B) + ABB - np.multiply((k + f), B)
            # np.multiply is the hadamard product

        self.A = A.reshape((self.size, self.size))
        self.B = B.reshape((self.size, self.size))
        return

if __name__ == '__main__':
#    Da = 0.14
#    Db = 0.06
#    f = 0.035
#    k =0.065
#
#    simulation = Simulation(400, 10000, Da, Db, f, k)
#    simulation.initial_conditions()
#    simulation.run()
#    simulation.show()
#
#    Da = 0.10
#    Db = 0.05
#    f = 0.055
#    k =0.062
#
#    simulation = Simulation(400, 50000, Da, Db, f, k)
#    simulation.initial_conditions()
#    simulation.run()
#    simulation.show()

    Da = 0.1
    Db = 0.05
    f = [0.01, 0.024] #Final and initial values for feed rate
    k = [0.045, 0.058]  # Final and initial values for the kill rate

    simulation = Simulation(300, 30000, Da, Db, f, k)
    simulation.initial_conditions()
    simulation.run()
    simulation.show()

    exit(0)
