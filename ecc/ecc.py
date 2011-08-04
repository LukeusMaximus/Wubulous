from mfi import mfi

import gmpy
from time import time
import random

class ecc:
    def __init__(self, a4, a6, mod):
        self.a4 = mfi(a4, mod)
        self.a6 = mfi(a6, mod)
        self.mod = mod        

    def is_quadratic_residue(self, x):
        l = x.jacobi()
        return l == 1

    def is_valid_point(self, x, y):
        x = mfi(x, self.mod)
        y = mfi(y, self.mod)
        r = x**3 + x*self.a4 + self.a6
        l = y**2
        return l == r

    def get_point(self, n):
        x = mfi(n, self.mod)
        while x != 0:
            t = x * x * x + self.a4 * x + self.a6
            if t == 0:
                return [(x, mfi(0, self.mod))]
            elif self.is_quadratic_residue(t):
                return [(x, t.sqrt()), (x, -t.sqrt())]
            x += 1
        return []

    def get_random_point(self):
        r = gmpy.mpz(random.random() * self.mod)
        return random.choice(self.get_point(r))

    def get_points_list(self):
        points = [(0,1)]
        x = mfi(1, self.mod)
        while x != 0:
            p = self.get_point(x)
            points += p
            x = p[0][0] + 1
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
    small_curve = ecc(1, 3, 7)
    print small_curve.get_points_list()
    curve = ecc(2147483656,2060571714,2147483659)
    point = curve.get_random_point()
    point2 = curve.multiply(point[0],point[1], random.randint(1,5))
    print point
    print point2
    assert ecc.is_valid_point(point2[0],point2[1])

