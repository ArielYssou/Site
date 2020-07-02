diags = [-4*main, inf, sup, main, main]
offsets = [0, -1, 1, -n, n]
self.Laplacian = dia_matrix((diags, offsets), shape=(n**2, n**2) )
