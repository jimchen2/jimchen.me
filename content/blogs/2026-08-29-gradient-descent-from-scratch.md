---
title: Gradient Descent From Scratch, In Fifty Lines
date: 2026-08-29
type: [ml, math]
preview_text: No frameworks, no autograd. Just the update rule, a stopping condition, and enough linear algebra to see why the learning rate is not a free parameter.
---

Every framework will do this for you. I still think it is worth writing once by hand, because the update rule is the whole idea and everything else is bookkeeping.

## The problem

We have $m$ examples, each a feature vector $x^{(i)} \in \mathbb{R}^n$ with a target $y^{(i)}$. Stack them into a matrix $X \in \mathbb{R}^{m \times n}$ and a vector $y \in \mathbb{R}^m$. Our model is linear:

$$h_\theta(x) = x^\top \theta$$

and we measure error with the mean squared loss

$$J(\theta) = \frac{1}{2m} \sum_{i=1}^{m} \left( h_\theta(x^{(i)}) - y^{(i)} \right)^2 = \frac{1}{2m} \lVert X\theta - y \rVert_2^2 .$$

The $\tfrac{1}{2}$ is there purely so the derivative looks clean.

## The gradient

Expanding the squared norm and differentiating with respect to $\theta$:

$$\nabla_\theta J(\theta) = \frac{1}{m} X^\top (X\theta - y)$$

Three lines of derivation, and it is worth doing them once on paper so that the shape is obvious: $X^\top$ is $n \times m$, the residual is $m \times 1$, so the gradient is $n \times 1$ — the same shape as $\theta$, as it must be.

## The update

$$\theta_{t+1} = \theta_t - \alpha \, \nabla_\theta J(\theta_t)$$

That is the entire algorithm. Everything interesting is in the choice of $\alpha$.

```python
import numpy as np

def gradient_descent(X, y, lr=0.05, tol=1e-9, max_iter=10_000):
    m, n = X.shape
    theta = np.zeros(n)

    for step in range(max_iter):
        residual = X @ theta - y          # (m,)
        grad = (X.T @ residual) / m       # (n,)

        loss = 0.5 * (residual @ residual) / m
        if step % 500 == 0:
            print(f"step {step:5d}  loss {loss:.6e}")

        step_vec = lr * grad
        theta = theta - step_vec

        # Stop when the parameters stop moving meaningfully.
        if np.linalg.norm(step_vec) < tol:
            print(f"converged at step {step}")
            break

    return theta
```

Run it against a known answer and check that it lands there:

```python
rng = np.random.default_rng(0)
X = rng.normal(size=(500, 3))
true_theta = np.array([1.5, -2.0, 0.5])
y = X @ true_theta + rng.normal(scale=0.01, size=500)

theta = gradient_descent(X, y)
print(np.round(theta, 3))   # [ 1.5  -2.   0.5 ]
```

## Why the learning rate is not a free parameter

For a quadratic loss the Hessian is constant:

$$H = \nabla^2_\theta J = \frac{1}{m} X^\top X$$

whose eigenvalues are the (scaled) squared singular values of $X$. Write $L$ for the largest eigenvalue and $\mu$ for the smallest. Plain gradient descent converges linearly:

$$J(\theta_t) - J(\theta^{*}) \le \left( 1 - \frac{\mu}{L} \right)^t \left( J(\theta_0) - J(\theta^{*}) \right)$$

provided $0 < \alpha < 2/L$. The ratio $\kappa = L/\mu$ is the condition number, and it is the whole story:

| Condition number $\kappa$ | Iterations to cut error by 10x |
| --- | --- |
| 10 | ~3 |
| 100 | ~50 |
| 1000 | ~500 |

If a feature is measured in millimetres and another in kilometres, $\kappa$ explodes and the loss surface becomes a long narrow valley. Gradient descent zig-zags across the valley instead of following it. Standardising the columns first costs one line and usually buys you an order of magnitude in iterations:

```python
X = (X - X.mean(axis=0)) / X.std(axis=0)
```

## Two things that break it in practice

**Too large a step.** If $\alpha > 2/L$ the iterates diverge. In code this looks like the loss printing `nan` after a few hundred steps, which is at least loud.

**A silent plateau.** With a badly conditioned problem the loss decreases so slowly that a tolerance on the loss itself never fires. I stopped on the norm of the *step* above for exactly this reason: it measures whether the optimiser is still doing anything, not whether it has got anywhere.

## Where this goes next

Momentum, Adam, second-order methods, and line search are all responses to the same complaint: vanilla gradient descent uses one scalar step size for a surface whose curvature varies by direction. But the skeleton never changes — compute a direction, scale it, move. Fifty lines, and you can see all of it.
