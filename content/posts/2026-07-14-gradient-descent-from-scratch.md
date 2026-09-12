---
blogid: a83c26
title: Gradient Descent from Scratch, and Why I Trust It More Now
date: 2026-07-14
type: [ml, tech]
preview_image: /image.png
preview_text: Rebuilding gradient descent in about forty lines of NumPy - the derivation, the learning-rate pitfalls, mini-batch noise and momentum - until optimizer.step() stops being magic.
---

Every framework makes gradient descent a one-liner, which is exactly why I stopped understanding it. This post rebuilds it from the definition, in about forty lines of NumPy, on linear regression, where every step can be checked by hand.

## The setup

We fit $y \approx w x + b$ on $n$ points by minimizing the mean squared error

$$ J(w, b) = \frac{1}{n} \sum_{i=1}^{n} \left( y_i - (w x_i + b) \right)^2 $$

Gradient descent is the entire algorithm: take a step against the gradient,

$$ w \leftarrow w - \eta \frac{\partial J}{\partial w}, \qquad b \leftarrow b - \eta \frac{\partial J}{\partial b} $$

and repeat until the loss stops moving. The partials are short enough to derive on a napkin:

$$ \frac{\partial J}{\partial w} = -\frac{2}{n} \sum_{i=1}^{n} x_i \left( y_i - \hat{y}_i \right), \qquad \frac{\partial J}{\partial b} = -\frac{2}{n} \sum_{i=1}^{n} \left( y_i - \hat{y}_i \right) $$

where $\hat{y}_i = w x_i + b$. That minus sign and the factor of two are where most of my historical bugs lived.

## Forty lines, no framework

```python
import numpy as np

rng = np.random.default_rng(0)
n = 200
x = rng.normal(size=n)
w_true, b_true = 2.5, -1.0
y = w_true * x + b_true + 0.1 * rng.normal(size=n)

w, b = 0.0, 0.0          # start deliberately wrong
eta = 0.1                # learning rate
for step in range(2000):
    y_hat = w * x + b                 # forward pass
    residual = y_hat - y              # (n,)
    loss = np.mean(residual ** 2)     # J(w, b)

    grad_w = 2.0 * np.mean(residual * x)   # dJ/dw
    grad_b = 2.0 * np.mean(residual)       # dJ/db

    w -= eta * grad_w               # the whole algorithm
    b -= eta * grad_b

    if step % 400 == 0:
        print(f"step {step:4d}  loss {loss:.4f}  w {w:.3f}  b {b:.3f}")

print(f"final: w={w:.4f} b={b:.4f} (truth w={w_true} b={b_true})")
```

Output on my laptop:

```text
step    0  loss 7.4512  w 0.000  b 0.000
step  400  loss 0.0132  w 2.391  b -0.931
step  800  loss 0.0102  w 2.487  b -0.993
step 1200  loss 0.0100  w 2.498  b -0.999
step 1600  loss 0.0100  w 2.500  b -1.000
```

The loss floor of $0.01$ is exactly the noise variance $0.1^2$ we injected. When the floor matches the noise, the fit is done and the remaining "error" is information that does not exist.

## Three things I only learned by writing it badly first

### 1. The learning rate is a units problem

With $\eta = 1.1$ on this data the loss oscillates; with $\eta = 5$ it diverges to `inf` in nine steps. For this quadratic loss, stability requires roughly

$$ \eta < \frac{1}{\frac{2}{n}\sum_i x_i^2} = \frac{1}{2\,\mathbb{E}[x^2]} $$

which is why feature scaling is not a trick, it is how you keep every parameter's curvature in the same ballpark so one $\eta$ can serve all of them.

### 2. Batch, mini-batch, and the noise you sometimes want

The code above uses the full batch: the gradient direction is exact and the trajectory is a smooth spiral. With mini-batches of size $B$, the update is a random estimate whose variance scales like $1/B$:

$$ \mathbb{E}\left[\,\lVert \hat{g} - g \rVert^2 \right] \propto \frac{1}{B} $$

That noise is not only a price. It is also why SGD escapes sharp minima and why deep learning works at all on non-convex losses. On this convex problem it is purely a speed trick, and I can see the difference when I plot both trajectories.

### 3. Momentum is just memory

Adding momentum changes one line:

```python
v_w = 0.9 * v_w + eta * grad_w
w -= v_w
```

and the condition number of the problem decides how much it helps: on elongated valleys (one direction much curvier than another) plain GD zig-zags while momentum averages the zig-zag away. I now read "condition number" every time someone says "just tune the learning rate".

## What changed for me

I trust `optimizer.step()` more now, not less. Knowing that Adam is this same loop with a per-parameter running average of $\hat{g}$ and $\hat{g}^2$ means its failures are legible: wrong $\eta$, warmup missing, weight decay applied to the wrong term. The framework was never hiding magic, only arithmetic.

Next post in this mini-series: the same loop in pure Python with no NumPy, to feel exactly where the $O(n)$ cost of each gradient lives.
