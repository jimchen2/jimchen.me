---
blogid: b79f31
title: The Basel Problem, Three Ways
date: 2026-05-30
type: [math]
preview_text: Three proofs that the sum of 1/n^2 equals pi^2/6 - Euler's infinite product for sine, Parseval's identity, and a double integral with one clever substitution. A junction where three roads of mathematics cross.
---

I keep coming back to the Basel problem,

$$ \sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}, $$

because it is the shortest distance I know between "a question a child can ask" and "a circle appearing from nowhere". Here are three proofs I like, in the order I learned them, each one smuggling $\pi$ in through a different door.

## 1. Euler: read the roots off the sine

Euler's original argument is not rigorous by modern standards and is still my favorite. The function $\sin(\pi x)/(\pi x)$ has simple zeros at every nonzero integer and value $1$ at $0$. A polynomial with those roots would factor over its roots, so Euler simply wrote the infinite analogue:

$$ \frac{\sin \pi x}{\pi x} = \prod_{n=1}^{\infty} \left( 1 - \frac{x^2}{n^2} \right) $$

Expand both sides to order $x^2$. On the left, the Taylor series of sine gives

$$ \frac{\sin \pi x}{\pi x} = 1 - \frac{\pi^2 x^2}{3!} + \frac{\pi^4 x^4}{5!} - \cdots $$

On the right, collecting the $x^2$ term from the product gives $-\sum_{n} \frac{x^2}{n^2}$. Matching coefficients:

$$ -\sum_{n=1}^{\infty} \frac{1}{n^2} = -\frac{\pi^2}{6} $$

and the door closes. (The same trick, one order higher, yields $\sum n^{-4} = \pi^4/90$; Euler pushed it to $\zeta(2k)$ in general, and the even zeta values have been tidy ever since.)

## 2. Parseval: the circle hides in Fourier coefficients

Take $f(x) = x$ on $(-\pi, \pi)$, extended periodically. It is odd, so its Fourier series is a sine series with coefficients

$$ b_n = \frac{1}{\pi} \int_{-\pi}^{\pi} x \sin(nx)\, dx = \frac{2(-1)^{n+1}}{n} $$

Parseval's identity says the energy in time equals the energy in frequency:

$$ \frac{1}{\pi} \int_{-\pi}^{\pi} |f(x)|^2\, dx = \sum_{n=1}^{\infty} b_n^2 $$

The left side is $\frac{1}{\pi} \cdot \frac{2\pi^3}{3} = \frac{2\pi^2}{3}$. The right side is $4 \sum_n \frac{1}{n^2}$. Divide by four:

$$ \sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6} $$

Here $\pi$ arrives honestly, through the geometry of $L^2$ and the fact that sines are orthogonal on an interval of length $2\pi$. This is the proof that generalizes: it is really a statement about how much room a function needs.

## 3. A double integral and one change of variables

The shortest rigorous proof I know, due to Beukers, Calabi and Kolk, starts from

$$ \sum_{n=1}^{\infty} \frac{1}{n^2} = \int_0^1 \!\! \int_0^1 \frac{dx\, dy}{1 - xy} $$

which follows by expanding $\frac{1}{1-xy} = \sum_n (xy)^{n-1}$ and integrating term by term. Then substitute

$$ u = \frac{y+x}{2}, \qquad v = \frac{y-x}{2} $$

The unit square maps to a square rotated by $45^\circ$, the integrand becomes $\frac{2}{1-u^2+v^2}$, and by symmetry one integrates over half of it:

$$ \int_0^1 \!\! \int_0^1 \frac{dx\, dy}{1-xy} = 4 \int_0^1 \!\! \int_0^{u} \frac{dv\, du}{1 - u^2 + v^2} $$

The inner integral is an arctangent, $\arctan\!\left(\frac{u}{\sqrt{1-u^2}}\right) = \arcsin(u)$, so the whole thing collapses to

$$ 4 \int_0^1 \frac{\arcsin u}{\sqrt{1-u^2}}\, du = 4 \cdot \frac{(\arcsin 1)^2}{2} = 2 \left( \frac{\pi}{2} \right)^2 = \frac{\pi^2}{6} $$

An arctangent, an arcsine, and a square: three places the circle could enter, and it only needs one.

## Why I collect these

Each proof uses a different machine — infinite products, orthogonality, a clever substitution — and each machine also proves other things. Euler's gives all $\zeta(2k)$; Parseval's gives the whole theory of $L^2$; the double integral generalizes to multiple zeta values, where it stops being cute and starts being research.

A problem with three proofs is not a problem with redundant solutions. It is a junction where three roads of mathematics happen to cross, and standing at the crossing is the closest I get to seeing the map.

> We do not prove theorems to believe them. We prove them to find out which room of the house they live in.

Next: why $\zeta(3)$ has no such proof, and what Apery actually did instead.
