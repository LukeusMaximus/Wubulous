import gmpy

class mfi:
    def __init__(self, i, n):
        self.val = gmpy.mpz(i)
        self.mod = gmpy.mpz(n)
    def __add__(self, x):
        return mfi((self.val + x.val) % self.mod, self.mod)
    def __sub__(self, x):
        return mfi((self.val - x.val) % self.mod, self.mod)
    def __mul__(self, x):
        return mfi((self.val * x.val) % self.mod, self.mod)
    def modinv(self):
        return mfi(gmpy.invert(self.val, self.mod), self.mod)
    def __int__(self):
        return int(self.val)
    def __str__(self):
        return str(self.val)

def __main__:
    a = mfi(4,7)
    b = mfi(5,7)
    print str(a + b)
    print str(a * b)
    print str(a - b)
    print str(a.modinv())
    print str(b.modinv())

if __name__ == "__main__":
    main()
