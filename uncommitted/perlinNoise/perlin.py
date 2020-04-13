import matplotlib.pyplot as plt
from noise import pnoise1 as noise
from numpy import linspace
from scipy.interpolate import interp1d

#fig, ax = plt.subplots(1)

X = list(linspace(0, 50, 50))
Y = [ noise(x) for x in X ]

xnew = list( linspace(0, 50, 1000) )
f = interp1d(X, Y, kind='cubic')

plt.plot(xnew, f(xnew),
        color='#4f3e54',
        ls='-',
        lw=2,
        label='Interpolated function'
        )
plt.plot(X, Y,
        ls='',
        marker='o',
        markersize=4.5,
        color = '#0077ff',
        label='Simplex values'
        )

plt.legend(frameon=False)
plt.tight_layout()
plt.savefig("noise_plots.png", transparent=True)
plt.show()


