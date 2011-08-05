import gmpy
import random

class mfi:
    def __init__(self, i, n): 
        if str(i.__class__).find("mfi") != -1:
            self.val = i.val
        else:
            self.val = gmpy.mpz(i)
        self.mod = gmpy.mpz(n)
        self.val = self.val % self.mod
    def mfi_(self, i):
        return mfi(i, self.mod)
    #comparisons
    def __eq__(self, x):
        x = self.mfi_(x)
        return self.val == x.val
    def __gt__(self, x):
        x = self.mfi_(x)
        return self.val > x.val
    def __ge__(self, x):
        x = self.mfi_(x)
        return self.val >= x.val
    def __lt__(self, x):
        x = self.mfi_(x)
        return self.val < x.val
    def __le__(self, x):
        x = self.mfi_(x)
        return self.val <= x.val
    def __ne__(self, x):
        x = self.mfi_(x)
        return self.val != x.val
    #operators
    def __neg__(self):
        return self.mfi_(self.mod - self.val)
    def __add__(self, x):
        x = self.mfi_(x)
        return self.mfi_(self.val + x.val)
    def __sub__(self, x):
        x = self.mfi_(x)
        return self.mfi_(self.val - x.val)
    def __mul__(self, x):
        x = self.mfi_(x)
        return self.mfi_(self.val * x.val)
    def __mod__(self, x):
        x = self.mfi_(x)
        return self.mfi_(self.val % x.val)
    def __pow__(self, x, mod=None):
        if str(x.__class__).find("mfi") != -1:
            x = x.val
        if x < 0:
            return self.mfi_(0)
        accum = self.mfi_(1)
        val = self
        while x > 0:
            if x % 2 == 0:
                x = x >> 1
                val = val * val
            else:
                x -= 1
                accum = accum * val             
        return self.mfi_(accum)
    def __rshift__(self, x):
        x = self.mfi_(x)
        return self.mfi_(self.val >> x.val)
    def __lshift__(self, x):
        x = self.mfi_(x)
        return self.mfi_(self.val << x.val)
    def modinv(self):
        return self.mfi_(gmpy.invert(self.val, self.mod))
    def is_square(self):
        return self.val.is_square()
    def sqrt(self):
        return self.mfi_(gmpy.sqrt(self.val))
    def modsqrt(self):
        if self.jacobi() != 1:
            return [self.mfi_(0)]
        q = self.mfi_(-1)
        s = self.mfi_(0)
        while q % 2 == 0:
            q = q >> 1
            s += 1
        z = self.mfi_(0)
        while z.jacobi() != -1:
            z += 1
        c = z ** q
        r = self ** ((q + 1) >> 1) 
        t = self ** q
        m = s
        while t != 1:
            i = self.mfi_(0)
            while t != 1:
                t = t * t
                i += 1
            b = c
            for j in xrange(0, m - i - 1):
                b = b * b
            r = r * b
            t = t * b * b
            c = b * b
            m = i
            root = self.mfi_(r)
        return [r, -r]
    def legendre(self):
        return self.__pow__((self.mod - 1) / 2)
    def jacobi(self):
        a = self.val
        b = self.mod
        if b <= 0 or b & 1 == 0:
            return self.mfi_(0)
        j = 1
        if a < 0:
            a = -a
            if b % 4 == 3:
                j = -j
        while a != 0:
            while a & 1 == 0:
                a = a >> 1
                if b % 8 == 3 or b % 8 == 5:
                    j = -j
            c = a
            a = b
            b = c
            if a % 4 == 3 and b % 4 == 3:
                j = -j
            a = a % b
        if b == 1:
            return self.mfi_(j)
        else:
            return self.mfi_(0)
    #converters
    def __int__(self):
        return int(self.val)
    def __str__(self):
        return str(self.val)
    def __repr__(self):
        return self.__str__()

def test(test, expected):
    if test == expected:
        print "PASS"
    else:
        print "FAIL: ", test, " != ", expected

def main():
    a = mfi(4,7)
    b = mfi(5,7)
    print "Operators:"
    test(a + b, 2)
    test(a * b, 6)
    test(a - b, 6)
    print "Modular inverse:"
    test(a.modinv(), 2)
    test(b.modinv(), 3)
    print "Operators with integers:"
    test(a - 2, 2)
    test(b + a + 496, 1)
    test(b * 3, 1)
    print "Comparisons:"
    test(a > b, False)
    test(a == b, False)
    test(a <= b, True)
    test(a != b, True)
    c = mfi(a,7)
    test(c == a, True)
    print "Negation:"
    test(-b, 2)
    test(-a, 3)
    print "Exponentiation:"
    h = mfi(3, 7)
    test(h ** h, 6)
    test(a ** 4, 4)
    test(b ** 2, 4)
    test(a ** b, 2)
    test(b ** b, 3)
    j = mfi(15, 31)
    k = mfi(3, 31)
    l = mfi(13, 31)
    test(k ** j, 30)
    test(j ** l, 27)
    m = mfi(344487, 333333)
    n = mfi(212105, 333333)
    test(m ** n, 290862)
    test(n ** m, 4096)
    test(m ** 444444, 296010)
    print "Legendre and Jacobi:"
    d = mfi(12345, 331)
    test(d.legendre(), -1)
    test(d.jacobi(), -1)
    test(b.jacobi(), -1)
    print "Modular square root:"
    f = mfi(10, 13)
    g = mfi(7, 13)
    test(f.modsqrt().sort(), [g, -g].sort())
    test((b ** 2).modsqrt().sort(), [b, -b].sort())

if __name__ == "__main__":
    main()
