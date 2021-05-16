import matplotlib.pyplot as plt
import pandas as pd

from sklearn.datasets import make_blobs 

# make data
X, y = make_blobs(
    n_samples=100,
    n_features=2,
    centers=4,
    cluster_std=[1, 2, 1, 3],
    random_state=42,
)

# Make it binary
y = [val % 2 for val in y]

fig, ax = plt.subplots(1)

ax.scatter(
    X[:, 0],
    X[:, 1],
    c=y
)

plt.show()

df = pd.DataFrame(
        zip(X[:, 0], X[:, 1], y),
        columns=['x0', 'x1', 'y']
)
df.to_csv('example_data.csv', index=False, header=True)
