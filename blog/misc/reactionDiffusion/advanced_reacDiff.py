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
        self.f = f # Feed rate
        self.k = k # Kill rate

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

    def initial_conditions(self, mode = 'center'):
        '''
        Sets the initial conditions
        '''

        if mode == 'center':
            r = 10 # radius
            mid = int(self.size / 2)
            #self.A[mid-r:mid+r, mid-r:mid+r] = 0.50
            self.B += 0.05 * random( (self.size, self.size) )
            self.B[mid-r:mid+r, mid-r:mid+r] = 1
        elif mode == 'random':
            #self.A += random( (self.size, self.size) ) 
            self.B += 0.1 * random( (self.size, self.size) )
        else:
            pass

        return 
    
    def show(self, newcmp = 'plasma_r', name = 'custom', save = False):
        '''
        Plots the final B concentration
        '''

        # Custom color map contruction
        if newcmp == 'oranges':
            N = 256
            vals = np.ones((N, 4))
            vals[:, 0] = np.linspace(252/256, 52/256, N)
            vals[:, 1] = np.linspace(116/256, 52/256, N)
            vals[:, 2] = np.linspace(20/256, 52/256, N)
            newcmp = ListedColormap(vals)
        else:
            pass

        fig,ax = plt.subplots(1)
        ax.imshow(self.A.tolist(), cmap=newcmp, interpolation='kaiser')
        ax.axis('off')
        fig.tight_layout()
        if save:
            plt.savefig(f'config_{name}_{cmap}.png', transparent = True)
        else:
            pass

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

        for _ in range(self.iters):
            try:
                ABB = A*B*B # To avoid doing the operation twice
            except RuntimeWarning:
                break
            A += Da * L.dot(A) - ABB + f * (1 - A)
            B += Db * L.dot(B) + ABB - (k + f) * B

        self.A = A.reshape((self.size, self.size))
        self.B = B.reshape((self.size, self.size))
        return

    def save(self):
        import os

        dir = './configurations'
        dir += f"/iters_{self.iters}"
        dir += f"/f_{self.f:.8f}"
        dir += f"/k_{self.k:.8f}"
        os.makedirs(dir)

        np.savetxt(f"{dir}/config_A.csv", self.A, delimiter=',')
        np.savetxt(f"{dir}/config_B.csv", self.B, delimiter=',')

    def load(self):
        dir = './configurations'
        dir += f"/iters_{self.iters}"
        dir += f"/f_{self.f:.8f}"
        dir += f"/k_{self.k:.8f}"

        self.A = np.loadtxt(f"{dir}/config_A.csv", delimiter = ',')
        self.B = np.loadtxt(f"{dir}/config_B.csv", delimiter = ',')
        
if __name__ == '__main__':
    from sys import argv
    patterns = {
            'a' : {
                'Da' : 0.2,
                'Db' : 0.1,
                'f': 0.0392,
                'k' : 0.0649,
                'cmap' : 'YlGnBu'
                },
            'b' : {
                'Da' : 0.2,
                'Db' : 0.1,
                'f': 0.0416,
                'k' : 0.0625,
                #'cmap' : 'YlGnBu'
                'cmap' : 'Spectral'
                },
            'c' : {
                'Da' : 0.2,
                'Db' : 0.1,
                'f': 0.0404,
                'k' : 0.0638,
                #'cmap' : 'YlGnBu'
                'cmap' : 'Spectral'
                #'cmap' : 'nipy_spectral'
                },
            'd' : {
                'Da' : 0.2,
                'Db' : 0.1,
                'f': 0.0208,
                'k' : 0.0576,
                'cmap' : 'YlGnBu'
                },
            'e' : {
                'Da' : 0.2,
                'Db' : 0.1,
                'f': 0.0175,
                'k' : 0.0504,
                #'cmap' : 'Blues'
                'cmap' : 'YlGnBu'
                #'cmap' : 'Spectral'
                },
            'f' : {
                'Da' : 0.2,
                'Db' : 0.1,
                'f': 0.0295,
                'k' : 0.0561,
                #'cmap' : 'oranges'
                #'cmap' : 'YlGnBu'
                'cmap' : 'jet_r'
                #'cmap' : 'nipy_spectral'
                }
            }

    if len(argv) > 1:
        pttrn = argv[1]
    else:
        pttrn = 'a'

    Da = patterns[pttrn]['Da']
    Db = patterns[pttrn]['Db']
    f = patterns[pttrn]['f']
    k = patterns[pttrn]['k']
    #cmap = patterns[pttrn]['cmap']
    cmap = 'gnuplot2_r'

    simulation = Simulation(400, 60000, Da, Db, f, k)
    try:
        simulation.load()
    except OSError: 
        simulation.initial_conditions()
        simulation.run()
        simulation.save()
    finally:
        simulation.show(cmap, name = pttrn, save = True)

    exit(0)
