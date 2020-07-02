import matplotlib.pyplot as plt

A_grid = [ [ 1 for x in range(200)] for y in range(200) ]
B_grid = [ [ 0 for x in range(200)] for y in range(200) ]

A_new = [ [ 1 for x in range(200)] for y in range(200) ]
B_new = [ [ 0 for x in range(200)] for y in range(200) ]

active_site = [ [ False for x in range(200)] for y in range(200) ]

global active_new
active_new = [ [ False for x in range(200)] for y in range(200) ]

for x in range(100,110):
    for y in range(100,110):
        B_grid[x][y] = 1
        active_site[x][y] = True
        active_new[x][y] = True

for x in range(99,111):
    for y in range(99,111):
        active_site[x][y] = True
        active_new[x][y] = True

def Laplace(mat, i, j):
    '''
    Returns the discrete Laplace operator of a give matrix at
    position (i,j) using a 9 point stencil
    '''
    ans = 0
#    ans -= 6 * mat[i][j]
#    ans += 1 * mat[i + 1][j]
#    ans += 1 * mat[i - 1][j]
#    ans += 1 * mat[i][j + 1]
#    ans += 1 * mat[i][j - 1]
#    ans += 0.5 * mat[i + 1][j + 1]
#    ans += 0.5 * mat[i + 1][j - 1]
#    ans += 0.5 * mat[i - 1][j + 1]
#    ans += 0.5 * mat[i - 1][j - 1]
#    ans /= 512

    ans -= mat[i][j]
    ans += 0.2 * mat[i + 1][j]
    ans += 0.2 * mat[i - 1][j]
    ans += 0.2 * mat[i][j + 1]
    ans += 0.2 * mat[i][j - 1]
    ans += 0.05 * mat[i + 1][j + 1]
    ans += 0.05 * mat[i + 1][j - 1]
    ans += 0.05 * mat[i - 1][j + 1]
    ans += 0.05 * mat[i - 1][j - 1]

    for x in range(i-1, i+2):
        for y in range(j-1, j+2):
            active_new[x][y] = True

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
iters = 400

for rep in range(iters):
    progress_bar(rep, iters)
    for i in range(1, 199):
        for j in range(1, 199):
            if not active_site[i][j]:
                continue

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
    active_site = active_new

print()
plt.matshow(B_grid)
plt.show()
plt.matshow(active_site)
plt.show()
