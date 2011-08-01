from pylab import *

import gmpy

def satisfies_curve(x, y):
    #check y^2 = x^3 + x + 3
    lhs = y * y
    lhs = lhs % 7
    rhs = x * x * x + x + 3
    rhs = rhs % 7


    return lhs == rhs

def ec(fsize):
    points = []
    for i in xrange(0, fsize):
        for j in xrange(0, fsize):
            if satisfies_curve(i, j):
               points.append((i,j))
    return points

def negate(x,y):
    return x, y+x

def modinv(n):
   return gmpy.invert(n, 7) 


def double(x1,y1):
    print "doubling"
    p = 7
    if (y1 == 1 and x1 == 0):
        return 0,1
    if (y1+y1) % 7 == 0:
        return 0,1
    print x1,y1
    mi = modinv(2*y1)
    print "mi",mi
    a4 = 1
    ld = (3*(x1*x1) + a4) * mi
    print "ld",ld
    ld = ld % p
    print "ld",ld
    x3 = ld*ld - x1 - x1
    x3 = x3 % 7
    y3 = ld * (x1 - x3) - y1
    y3 = y3 % 7
    print x3,y3
    
    return (int(x3), int(y3))

def add(x1,y1,x2,y2):
    ld = 0
    p = 7
    if (y1 == 1 and x1 == 0):
        return x2,y2
    elif (x2 == 0 and y2 == 1):
        return x1,y1
    
    if x1 == x2:
        if y1 == y2:
            return double(x1,y1)        
        else:
            return (0,1)
    else:
        ld = (y2-y1) * modinv(x2-x1)
        ld = ld % p
        x3 = ld*ld - x2 - x1
        x3 = x3 % 7
        y3 = ld * (x1 - x3) - y1
        y3 = y3 % 7
        
        return (int(x3), int(y3))
        

if __name__ == "__main__":
    x = []
    y = []
    for i,j in ec(7):
        x.append(i)
        y.append(j)


    pairs = ec(7)
    pairs.insert(0, (0,1))
    results = []
    for i in xrange(0,len(pairs)):
        results.append([])
        for j in xrange(0,len(pairs)):
            r = results[i]
            r.append(add(pairs[i][0],pairs[i][1],pairs[j][0],pairs[j][1]))
    for row in results:
        print row
