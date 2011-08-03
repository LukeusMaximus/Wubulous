import gmpy

class mfi:
    def __init__(self, i, n):
        if str(i.__class__).find("mfi") != -1:
            self.val = i.val
        else:
            self.val = gmpy.mpz(i)
        self.mod = gmpy.mpz(n)
        self.val = self.val % self.mod
    #comparisons
    def __eq__(self, x):
        if str(x.__class__).find("int") != -1:
            x = mfi(x, self.mod)
        return self.val == x.val
    def __gt__(self, x):
        if str(x.__class__).find("int") != -1:
            x = mfi(x, self.mod)
        return self.val > x.val
    def __ge__(self, x):
        if str(x.__class__).find("int") != -1:
            x = mfi(x, self.mod)
        return self.val >= x.val
    def __lt__(self, x):
        if str(x.__class__).find("int") != -1:
            x = mfi(x, self.mod)
        return self.val < x.val
    def __le__(self, x):
        if str(x.__class__).find("int") != -1:
            x = mfi(x, self.mod)
        return self.val <= x.val
    def __ne__(self, x):
        if str(x.__class__).find("int") != -1:
            x = mfi(x, self.mod)
        return self.val != x.val
    #operators
    def __neg__(self):
        return mfi((self.mod - self.val), self.mod)
    def __add__(self, x):
        if str(x.__class__).find("int") != -1:
            x = mfi(x, self.mod)
        return mfi((self.val + x.val) % self.mod, self.mod)
    def __sub__(self, x):
        if str(x.__class__).find("int") != -1:
            x = mfi(x, self.mod)
        return mfi((self.val - x.val) % self.mod, self.mod)
    def __mul__(self, x):
        if str(x.__class__).find("int") != -1:
            x = mfi(x, self.mod)
        return mfi((self.val * x.val) % self.mod, self.mod)
    def __pow__(self, x, mod=None):
        if mod == None:
            mod = self.mod
        
        return mfi(self.val ** x, mod)
    def modinv(self):
        return mfi(gmpy.invert(self.val, self.mod), self.mod)
    def is_square(self):
        return self.val.is_square()
    def sqrt(self):
        return mfi(gmpy.sqrt(self.val), self.mod)
    def legendre(self):
        return mfi(self.__pow__((self.mod - 1) / 2), self.mod)
    def jacobi(self):
        a = self.val
        b = self.mod
        if b <= 0 or b & 1 == 0:
            return mfi(0, self.mod)
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
            return mfi(j, self.mod)
        else:
            return mfi(0, self.mod)
    #converters
    def __int__(self):
        return int(self.val)
    def __str__(self):
        return str(self.val)
    def __repr__(self):
        return self.__str__()

def main():
    a = mfi(4,7)
    b = mfi(5,7)
    print str(a + b) #2
    print str(a * b) #6
    print str(a - b) #6
    print str(a.modinv()) #2
    print str(b.modinv()) #3
    print str(a - 2) #2
    print str(b + a + 496) #1
    print str(b * 3) #1
    print str(a > b) #False
    print str(a == b) #False
    print str(a <= b) #True
    print str(a != b) #True
    c = mfi(a,7)
    print str(c == a) #True
    print str(-b) #2
    print str(-a) #3
    print str(a ** 4) #4
    d = mfi(12345, 331)
    print d.legendre() #-1
    print d.jacobi() #-1

if __name__ == "__main__":
    main()
