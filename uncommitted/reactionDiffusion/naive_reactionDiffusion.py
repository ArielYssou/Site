import matplotlib.pyplot as plt

size = 100

A_grid = [ [ 1 for x in range(size)] for y in range(size) ]
B_grid = [ [ 0 for x in range(size)] for y in range(size) ]

A_new = [ [ 1 for x in range(size)] for y in range(size) ]
B_new = [ [ 0 for x in range(size)] for y in range(size) ]

for x in range(50,55):
    for y in range(50,55):
        B_grid[x][y] = 1

def Laplace(mat, i, j):
    '''
    Returns the discrete Laplace operator of a give matrix at
    position (i,j) using a 9 point stencil
    '''
    ans = 0
    weights = [ [0.05, 0.2, 0.05],
            [0.2, -1, 0.2],
            [0.05, 0.2, 0.02]]

    ans -= mat[i][j]
    ans += 0.2 * mat[i + 1][j]
    ans += 0.2 * mat[i - 1][j]
    ans += 0.2 * mat[i][j + 1]
    ans += 0.2 * mat[i][j - 1]
    ans += 0.05 * mat[i + 1][j + 1]
    ans += 0.05 * mat[i + 1][j - 1]
    ans += 0.05 * mat[i - 1][j + 1]
    ans += 0.05 * mat[i - 1][j - 1]

    return ans

def constrain(num, begin, end):
    if num > end:
        num = end
    elif num < begin:
        num = begin
    else:
        pass
    return num

def progress_bar(current, total):
    prog = int( (current / total) * 70)
    print("\r", end = '')
    for _ in range(prog):
        print("\033[102m \033[0m", end = '')
    for _ in range(prog, 70):
        print("\033[48;5;0m \033[0m", end = '')

Da = 1
Db = 0.5
f = 0.0367
k = 0.0649
iters = 4000

for rep in range(iters):
    progress_bar(rep, iters)
    for i in range(1, 199):
        for j in range(1, 199):

            A = A_grid[i][j]
            B = B_grid[i][j]
            #if B == 0 and A == 1:
                #continue

            A_new[i][j] = A
            B_new[i][j] = B

            A_new[i][j] += Da * Laplace(A_grid, i, j) - A * (B ** 2) + f * (1 - A)
            B_new[i][j] += Db * Laplace(B_grid, i, j) + A * (B ** 2) - (k + f) * B

            A_new[i][j] = constrain(A_new[i][j], 0 ,1)
            B_new[i][j] = constrain(B_new[i][j], 0 ,1)

    A_grid = A_new
    B_grid = B_new

print()
plt.matshow(B_grid)
plt.show()
