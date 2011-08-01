from mfi import mfi


class ecc:
    def __init__(self, a4, a6, mod):
        self.a4 = mfi(a4, mod)
        self.a6 = mfi(a6, mod)
        self.mod = mod
    def satisfies_curve(self, x, y):
        y = mfi(y, self.mod)
        x = mfi(x, self.mod)
        lhs = y * y
        rhs = x * x * x + self.a4 * x + self.a6

        return lhs == rhs

    def get_points_list(self):
        points = []
        for i in xrange(0, self.mod):
            for j in xrange(0, self.mod):
                if self.satisfies_curve(i, j):
                    points.append((i,j))
        return points

    def negate(self, x,y):
        x = mfi(x, self.mod)
        y = mfi(y, self.mod)
        return x, y + x
    def modinv(self, n):
        n = mfi(n, self.mod)
        return n.modinv()

    def double(self, x1, y1):
        x1 = mfi(x1, self.mod)
        y1 = mfi(y1, self.mod)

        if (y1 == 1 and x1 == 0):
            return 0,1
        if (y1 + y1) == 0:
            return 0,1

        mi = self.modinv(y1 * 2)
        a4 = mfi(self.a4, self.mod)
        ld = (x1*x1*3 + a4) * mi
        x3 = ld * ld - x1 - x1
        y3 = ld * (x1 - x3) - y1
        return x3, y3

    def add(self, x1, y1, x2, y2):
        ld = 0
        x1 = mfi(x1, self.mod)
        y1 = mfi(y1, self.mod)
        x2 = mfi(x2, self.mod)
        y2 = mfi(y2, self.mod)

        if (y1 == 1 and x1 == 0):
            return x2, y2
        elif (x2 == 0 and y2 == 1):
            return x1,y1

        if x1 == x2:
            if y1 == y2:
                return self.double(x1,y1)
            else:
                return (0,1)

        else:
            ld = (y2 - y1) * (x2-x1).modinv()
            x3 = ld * ld - x2 - x1
            y3 = ld * (x1 - x3) - y1
            return x3, y3

    def multiply(self, x1, y1, factor):
        accum = (x1, y1)
        for i in xrange(0, factor - 1):
            accum = self.add(accum[0], accum[1], x1, y1)
        return accum


if __name__ == "__main__":
    x = []
    y = []
    curve = ecc(1,3,7)
    pairs = curve.get_points_list()
    print curve.double(pairs[0][0], pairs[0][1])
    print curve.multiply(pairs[0][0], pairs[0][1], 2)

