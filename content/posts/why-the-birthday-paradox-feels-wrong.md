---
title: Why the Birthday Paradox Feels Wrong
date: 2026-02-09
type: [math]
preview_text: Twenty-three people is all it takes. The reason it feels impossible is that we compute the answer for the wrong question, and there is a small simulation at the bottom if you do not believe me.
---

Twenty-three people is all it takes for a better-than-even chance that two of them share
a birthday. The number feels absurd until you count the comparisons instead of the
people.

## The wrong question

We instinctively ask: *what is the chance that somebody shares my birthday?* With $n$
people that chance is

$$
1 - \left(\frac{364}{365}\right)^{n-1},
$$

which is still only about $6\%$ at $n = 23$. That is the number people are estimating,
and it is not the question. In a group of 23 there are

$$
\binom{23}{2} = \frac{23 \cdot 22}{2} = 253
$$

*pairs* of people. Each pair is a ticket in a lottery with a $1/365$ chance of winning.

## The right question

Assume birthdays are independent and uniform over 365 days. It is far easier to count
the probability that *no* pair matches. Fill seats one at a time:

$$
\Pr(\text{all distinct})
= \prod_{k=1}^{n-1}\left(1 - \frac{k}{365}\right)
= \frac{365!}{(365-n)!\,365^{\,n}} .
$$

For $n = 23$ this is about $0.4927$, so

$$
\Pr(\text{at least one match}) \approx 1 - 0.4927 = 0.5073 .
$$

Slightly better than a coin flip. The crossover happens at 23, and by 41 people the
probability is over $90\%$.

## Generalizing

For a year with $d$ days, taking logs and using
$\ln(1-x) \approx -x$ for small $x$ gives

$$
\ln \Pr(\text{distinct}) \approx -\frac{1}{d}\sum_{k=1}^{n-1} k
= -\frac{n(n-1)}{2d},
$$

so setting the probability to $1/2$ gives $n(n-1) \approx 2d\ln 2$, i.e.

$$
n \approx 1.177\sqrt{d} .
$$

That square root is the whole story. Doubling the number of days only multiplies the
threshold group size by $\sqrt{2}$. The same $\sqrt{d}$ law explains hash collisions:
with 64-bit hashes you expect a collision somewhere around $1.177 \cdot 2^{32} \approx
5 \times 10^{9}$ items, which is why nobody worries about random collisions and
everybody worries about birthday *attacks*.

## Simulate it

```javascript
function trial(n, days = 365) {
  const seen = new Set();
  for (let i = 0; i < n; i++) {
    const day = Math.floor(Math.random() * days);
    if (seen.has(day)) return true;
    seen.add(day);
  }
  return false;
}

const n = 23;
const trials = 200_000;
let hits = 0;
for (let i = 0; i < trials; i++) hits += trial(n);

console.log(hits / trials); // ~0.507
```

## The actual lesson

The paradox is not about birthdays. It is about the difference between "count the
objects" and "count the interactions". Any time you catch yourself reasoning about a
system by counting its parts, ask how many pairs of parts there are:

| Objects | Pairs |
| --- | --- |
| 10 | 45 |
| 23 | 253 |
| 100 | 4,950 |
| 1,000 | 499,500 |

Quadratic growth is why distributed systems are hard, why code review gets slower as a
diff gets longer, and why a party of 23 people is not nine times harder to schedule than
a party of 23 individual humans would suggest. Pairs are the unit of surprise.
