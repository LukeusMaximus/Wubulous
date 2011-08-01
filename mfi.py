import gmpy

class mfi:
    def __init__(self, i, n):
        self.val = gmpy.mpz(i)
        self.mod = gmpy.mpz(n)
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
    def modinv(self):
        return mfi(gmpy.invert(self.val, self.mod), self.mod)
    #converters
    def __int__(self):
        return int(self.val)
    def __str__(self):
        return str(self.val)

def main():
    a = mfi(4,7)
    b = mfi(5,7)
    print str(a + b)
    print str(a * b)
    print str(a - b)
    print str(a.modinv())
    print str(b.modinv())
    print str(a - 2)
    print str(b + a + 496)
    print str(b * 3)

if __name__ == "__main__":
    main()
