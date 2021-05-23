import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn import datasets

def func1(x):
    '''
    Generates dummy data for demonstrations
    '''

    return 2 * np.sqrt(x) + np.sin(x * 2) + 0.25 * np.random.random()

def func2(x):
    '''
    Generates dummy data for demonstrations
    '''

    return 4 * np.sqrt(x) + np.sin(x * 1.7) + 0.3 * np.random.random()


# 1st line plot data
X = np.arange(0, 10, 0.1)
y = list(map(func1, X))
data = pd.DataFrame(zip(X, y), columns=['X', 'y'])
data.to_csv('data_1.csv', header=True, index=False)
plt.plot(X, y)

# 2nd line plot data
X = np.arange(0, 10, 0.1)
y = list(map(func2, X))
data = pd.DataFrame(zip(X, y), columns=['X', 'y'])
data.to_csv('data_2.csv', header=True, index=False)
plt.plot(X, y)

# Make scatter data exemple
iris = datasets.load_iris()
df = pd.DataFrame(iris.data, columns=[feat.replace(' ', '_').replace('_(cm)', '') for feat in iris.feature_names])
df['species'] = iris.target
df.to_csv('data_iris.csv', header=True, index=False)
print(df.info())

plt.show()
