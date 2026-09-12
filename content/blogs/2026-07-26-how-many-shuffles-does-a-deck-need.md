---
title: How Many Shuffles Does a Deck Actually Need?
date: 2026-07-26
type: [math]
preview_text: A count of permutations, a classic buggy shuffle, and the fact that a uniformly random deck contains exactly one fixed point on average.
---

I got into an argument at a game night about how long to shuffle. It ended with me writing Python at the table, which is not a win for anyone. Here is what came out of it.

## How big is the space?

A deck of 52 cards has

$$52! = 80{,}658{,}175{,}170{,}943{,}878{,}571{,}660{,}636{,}856{,}403{,}766{,}975{,}289{,}505{,}440{,}883{,}277{,}824{,}000{,}000{,}000{,}000$$

possible orders, roughly $8.07 \times 10^{67}$. Stirling's approximation gets you most of the way there without a computer:

$$n! \approx \sqrt{2\pi n}\left(\frac{n}{e}\right)^{n}$$

## The shuffle everyone writes first, and why it is wrong

```python
import random

def bad_shuffle(cards):
    for i in range(len(cards)):
        j = random.randrange(len(cards))   # bug: full range every time
        cards[i], cards[j] = cards[j], cards[i]
    return cards
```

There are $n^n$ equally likely execution paths through that loop, and $n!$ possible outcomes. For $n = 52$ those numbers are $52^{52}$ and $52!$, and $n^n$ is not a multiple of $n!$, so **some permutations must be more likely than others**. The bias is small but measurable, and it is exactly the kind of thing that ruins a simulation.

The fix is Fisher–Yates, which picks the swap partner from the part of the array that has not been placed yet:

```python
def fisher_yates(cards):
    for i in range(len(cards) - 1, 0, -1):
        j = random.randrange(i + 1)     # only the unplaced region
        cards[i], cards[j] = cards[j], cards[i]
    return cards
```

Why is this uniform? The last card is chosen from $n$ candidates, the second-to-last from $n-1$, and so on. The probability of producing any specific ordering is therefore

$$\frac{1}{n} \cdot \frac{1}{n-1} \cdots \frac{1}{2} \cdot \frac{1}{1} = \frac{1}{n!}$$

Every permutation gets exactly one path and exactly the same probability.

## A free fact: expected fixed points

Let $X$ be the number of cards that end up in their original position after a uniformly random shuffle. Define indicator variables

$$X_i = \begin{cases} 1 & \text{if card } i \text{ stays put} \\ 0 & \text{otherwise} \end{cases}$$

so $X = \sum_{i=1}^{n} X_i$. Since $\Pr[X_i = 1] = \frac{1}{n}$, linearity of expectation gives

$$\mathbb{E}[X] = \sum_{i=1}^{n} \mathbb{E}[X_i] = n \cdot \frac{1}{n} = 1$$

One card per deck, on average, regardless of deck size. No independence needed — linearity of expectation does not care.

## And the probability that nothing stays put

The number of permutations with no fixed points (derangements) is $!n$, and

$$\frac{!n}{n!} = \sum_{k=0}^{n} \frac{(-1)^k}{k!} \longrightarrow \frac{1}{e} \approx 0.3679$$

as $n \to \infty$. Convergence is fast: for $n = 52$ the value agrees with $1/e$ to far more digits than anyone at a game night needs. So about 37% of well-shuffled decks have no card in its starting position.

Quick simulation to check both claims:

```python
import random
from math import factorial

def stats(trials=200_000, n=52):
    fixed_total = 0
    derangements = 0
    for _ in range(trials):
        deck = list(range(n))
        fisher_yates(deck)
        fixed = sum(1 for i, c in enumerate(deck) if c == i)
        fixed_total += fixed
        derangements += (fixed == 0)
    print("E[fixed] =", fixed_total / trials)          # ~1.0
    print("P(no fixed) =", derangements / trials)      # ~0.368
    print("1/e =", 1 / 2.718281828459045)

stats()
```

## Back to the argument

The honest answer about physical riffle shuffles is a result I am happy to quote without re-deriving: Persi Diaconis and Dave Bayer showed that the number of riffle shuffles needed to be close to uniform in *total variation distance* grows like $\tfrac{3}{2}\log_2 n$, which for 52 cards lands near seven. Under-shuffling is very visible; over-shuffling costs you nothing but time.

So: seven riffles, and never, ever the first shuffle function you think of.
