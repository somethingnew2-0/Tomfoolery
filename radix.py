from random import randint
from math import log10
from time import clock
from itertools import chain

def splitmerge0 (ls, digit): ## python (pure!)

    seq = map (lambda n: ((n // 10 ** digit) % 10, n), ls)
    buf = {0:[], 1:[], 2:[], 3:[], 4:[], 5:[], 6:[], 7:[], 8:[], 9:[]}

    return reduce (lambda acc, key: acc.extend(buf[key]) or acc,
        reduce (lambda _, (d,n): buf[d].append (n) or buf, seq, buf), [])

def splitmerge1 (ls, digit): ## python (readable!)
    buf = [[] for i in range(10)]
    divisor = 10 ** digit
    for n in ls:
        buf[(n//divisor)%10].append(n)
    return chain(*buf)

def radixsort (ls, fn = splitmerge1):
    return list(reduce (fn, xrange (int (log10 (max(abs(val) for val in ls)) + 1)), ls))

###############################################################################
# quick sort
###############################################################################

def partition (ls, start, end, pivot_index):

    lower = start
    upper = end - 1

    pivot = ls[pivot_index]
    ls[pivot_index] = ls[end]

    while True:

        while lower <= upper and ls[lower] <  pivot: lower += 1
        while lower <= upper and ls[upper] >= pivot: upper -= 1
        if lower > upper: break

        ls[lower], ls[upper] = ls[upper], ls[lower]

    ls[end] = ls[lower]
    ls[lower] = pivot

    return lower

def qsort_range (ls, start, end):

    if end - start + 1 < 32:
        insertion_sort(ls, start, end)
    else:
        pivot_index = partition (ls, start, end, randint (start, end))
        qsort_range (ls, start, pivot_index - 1)
        qsort_range (ls, pivot_index + 1, end)

    return ls

def insertion_sort (ls, start, end):

    for idx in xrange (start, end + 1):
        el = ls[idx]
        for jdx in reversed (xrange(0, idx)):
            if ls[jdx] <= el:
                ls[jdx + 1] = el
                break
            ls[jdx + 1] = ls[jdx]
        else:
            ls[0] = el

    return ls

def quicksort (ls):

    return qsort_range (ls, 0, len (ls) - 1)

if __name__=='__main__':
    for value in 1000, 10000, 100000, 1000000, 10000000:
        ls = [randint (1, value) for _ in range(value)]
        ls2 = list(ls)
        last = -1
        start = clock()
        ls = radixsort(ls)
        end = clock()
        for i in ls:
            assert last <= i
            last = i
        print("rs %d: %0.2fs" % (value, end-start))
        tdiff = end-start
        start = clock()
        ls2 = quicksort(ls2)
        end = clock()
        last = -1
        for i in ls2:
            assert last <= i
            last = i
        print("qs %d: %0.2fs %0.2f%%" % (value, end-start, ((end-start)/tdiff*100)))
