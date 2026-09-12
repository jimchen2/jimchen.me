---
title: Least Squares Is an Orthogonal Projection
date: 2026-04-07
type: [math, ml]
preview_text: The normal equations are usually presented as a calculus result. They are really a geometry result, and the geometry makes the whole thing obvious.
---

The normal equations are usually presented as a calculus result: write down the sum of
squared errors, differentiate, set the gradient to zero, solve. That works. But the
reason least squares is the *right* thing to do — and the reason it looks the way it
does — is geometry.

## Setting up

We have a design matrix $A \in \mathbb{R}^{m \times n}$ and a target vector
$b \in \mathbb{R}^m$. We want $x \in \mathbb{R}^n$ minimizing

$$
\min_{x \in \mathbb{R}^n} \;\lVert Ax - b \rVert_2^2 .
$$

The key observation is about the set

$$
\mathcal{C}(A) = \{\, Ax : x \in \mathbb{R}^n \,\} \subseteq \mathbb{R}^m ,
$$

the column space of $A$. As $x$ ranges over $\mathbb{R}^n$, the point $Ax$ ranges over
a subspace of $\mathbb{R}^m$ — a plane through the origin, if $n = 2$ and $m = 3$.

So the problem is not "solve $Ax = b$". It is:

> Find the point in the subspace $\mathcal{C}(A)$ closest to $b$.

## The closest point is the perpendicular one

Let $\hat{x}$ be a candidate and let $\hat{b} = A\hat{x}$ be the corresponding point in
the subspace. We move $\hat{b}$ by any vector in $\mathcal{C}(A)$, say $Av$:

$$
\lVert (A\hat{x} + Av) - b \rVert_2^2
= \lVert (\hat{b} - b) + Av \rVert_2^2
= \lVert \hat{b} - b \rVert_2^2 + 2\langle \hat{b} - b,\, Av \rangle + \lVert Av \rVert_2^2 .
$$

If the middle term is zero for every $v$, then the first term is already minimal and we
are done. If it is nonzero for some $v$, we can pick $v$ in that direction with a small
step and decrease the sum. So optimality is exactly the statement

$$
\langle \hat{b} - b,\, Av \rangle = 0 \quad \text{for all } v \in \mathbb{R}^n .
$$

Pulling the transpose across the inner product, $\langle \hat{b} - b, Av\rangle = (A^\top(\hat{b}-b))^\top v$,
and requiring this to vanish for *every* $v$ forces

$$
A^\top (\hat{b} - b) = 0 \quad \Longleftrightarrow \quad A^\top A \hat{x} = A^\top b .
$$

Those are the normal equations, and no derivative was taken. The residual
$r = b - A\hat{x}$ is orthogonal to every column of $A$; the "normal equations" are
named after that right angle.

## What this buys you

A few things become immediate rather than computational:

1. **Existence, always.** $\mathcal{C}(A)$ is closed, so a nearest point exists.
2. **Uniqueness, sometimes.** If $A$ has independent columns, $A^\top A$ is invertible
   and $\hat{x} = (A^\top A)^{-1} A^\top b$ is the unique minimizer. If not, the
   *fitted values* $A\hat{x}$ are still unique even though the coefficients are not —
   which is why ridge regression can exist at all.
3. **Pythagoras for free.** Since $r \perp A\hat{x}$,

$$
\lVert b \rVert_2^2 = \lVert A\hat{x} \rVert_2^2 + \lVert r \rVert_2^2 ,
$$

so the total variation splits cleanly into "explained" and "residual". The familiar
coefficient of determination is this identity in disguise:

$$
R^2 = 1 - \frac{\lVert r \rVert_2^2}{\lVert b - \bar{b}\mathbf{1} \rVert_2^2} .
$$

## The numerical footnote

Geometry says $(A^\top A)^{-1} A^\top b$; floating point says *don't*. Forming
$A^\top A$ squares the condition number, so a problem with $\kappa(A) = 10^8$ becomes
one with $\kappa = 10^{16}$ and your ten digits of accuracy are gone. In practice you
use a QR factorization and solve $R\hat{x} = Q^\top b$, which is the same projection
computed by an algorithm that respects the geometry.

That gap between the true statement and the stable computation is, in my experience,
where most of applied mathematics actually lives.
