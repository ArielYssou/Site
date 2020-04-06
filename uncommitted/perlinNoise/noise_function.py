import matplotlib.pyplot as plt

from numpy import linspace
from numpy.random import normal
from scipy.interpolate import interp1d

fig, ax = plt.subplots(2,1)

vals = normal(10, 3, 7)
for i, val in enumerate(vals):
    ax[0].plot([i, i + 1], [val, val], c='#fc7414', lw=2)
    if i > 0:
        ax[0].plot([i, i], [vals[i - 1], vals[i]],
                ls='--', c='gray',lw=1)

x = list(range(len(vals)))
f = interp1d(x,vals, kind='cubic')

xnew = linspace(0, x[-1], 100)
ax[1].plot(xnew, f(xnew), ls='--', c='black',lw=1.5)
ax[1].plot(x, vals, ls='', marker='o',
        markersize=7, markerfacecolor='red',
        markeredgecolor='red')

fig.savefig('noise_plots.png')

plt.show()
