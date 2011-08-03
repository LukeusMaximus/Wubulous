import gmpy

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
    def __pow__(self, x, mod=None):
        x = self.mfi_(x)
        if mod == None:
            mod = self.mod
        return self.mfi_(self.val ** x.val)
    def modinv(self):
        return self.mfi_(gmpy.invert(self.val, self.mod))
    def is_square(self):
        return self.val.is_square()
    def sqrt(self):
        return self.mfi_(gmpy.sqrt(self.val))
    def legendre(self):
        return self.mfi_(self.__pow__((self.mod - 1) / 2))
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
        return "PASS"
    else:
        return "FAIL: " + test + " != " + expected

def main():
    a = mfi(4,7)
    b = mfi(5,7)
    print test(a + b, 2)
    print test(a * b, 6)
    print test(a - b, 6)
    print test(a.modinv(), 2)
    print test(b.modinv(), 3)
    print test(a - 2, 2)
    print test(b + a + 496, 1)
    print test(b * 3, 1)
    print test(a > b, False)
    print test(a == b, False)
    print test(a <= b, True)
    print test(a != b, True)
    c = mfi(a,7)
    print test(c == a, True)
    print test(-b, 2)
    print test(-a, 3)
    print test(a ** 4, 4)
    d = mfi(12345, 331)
    print test(d.legendre(), -1)
    print test(d.jacobi(), -1)

if __name__ == "__main__":
    main()
