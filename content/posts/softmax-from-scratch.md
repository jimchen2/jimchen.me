---
title: Softmax From Scratch, With the Trick That Makes It Stable
date: 2026-03-21
type: [ml, math, programming]
preview_text: Softmax looks harmless until an exponent overflows. Here is the derivation, the numerically stable version, and a NumPy implementation with a backward pass.
---

Softmax looks harmless until an exponent overflows. Here is the derivation and the
version that actually survives real logits.

## Definition

Given logits $z \in \mathbb{R}^{n}$, softmax produces a probability distribution:

$$
\sigma(z)_i = \frac{e^{z_i}}{\sum_{j=1}^{n} e^{z_j}} .
$$

It is order preserving, it sums to one, and it is *not* invariant to shifting — except
that it is. For any constant $c$,

$$
\frac{e^{z_i + c}}{\sum_j e^{z_j + c}}
= \frac{e^{c} e^{z_i}}{e^{c} \sum_j e^{z_j}}
= \frac{e^{z_i}}{\sum_j e^{z_j}} .
$$

That cancellation is the entire trick. The function is unchanged, but we are free to
choose $c$ to keep the exponents small.

## Why the naive version breaks

If $z_i = 1000$, then $e^{1000}$ overflows a 64-bit float and you get `inf`, and
`inf / inf` is `nan`. If $z_i = -1000$ you get `0.0` for every term and the result is
`0 / 0`. Neither is exotic — unnormalized logits from a language model routinely reach
magnitudes where this matters.

Choosing $c = \max_j z_j$ makes the largest exponent exactly $e^0 = 1$:

$$
\sigma(z)_i = \frac{e^{\,z_i - \max_j z_j}}{\sum_{j=1}^{n} e^{\,z_j - \max_j z_j}} .
$$

No term overflows, at least one term is $1$, so the denominator is at least $1$ and the
result is always a valid distribution.

## The implementation

```python
import numpy as np

def softmax(z, axis=-1):
    """Numerically stable softmax along `axis`."""
    z = np.asarray(z, dtype=np.float64)
    z_shifted = z - np.max(z, axis=axis, keepdims=True)
    exp = np.exp(z_shifted)
    return exp / np.sum(exp, axis=axis, keepdims=True)
```

Three details are load-bearing:

- `keepdims=True` keeps broadcasting honest instead of silently reshaping along the
  wrong axis.
- The max is per-row when `axis=-1`, not global.
- `dtype=np.float64` prevents an integer array from producing integer division.

## The backward pass

For training we need the Jacobian. Write $p = \sigma(z)$. Then

$$
\frac{\partial p_i}{\partial z_j} = p_i (\delta_{ij} - p_j),
$$

which in matrix form is $\operatorname{diag}(p) - p p^\top$. In a network you never
build that matrix; you multiply by the incoming gradient $g = \partial L / \partial p$:

$$
\frac{\partial L}{\partial z} = p \odot \left( g - (g^\top p)\, \mathbf{1} \right).
$$

```python
def softmax_backward(grad_output, probs):
    """Vector-Jacobian product for softmax along the last axis."""
    inner = np.sum(grad_output * probs, axis=-1, keepdims=True)
    return probs * (grad_output - inner)
```

The $g^\top p$ scalar is the only coupling between coordinates. When the loss is
cross-entropy, this collapses even further: with $L = -\log p_y$ the whole expression
reduces to $p - e_y$, which is why every framework fuses the two ops together.

## A quick sanity check

```python
z = np.array([1000.0, 1000.0, 1000.0])
print(softmax(z))   # [0.33333333 0.33333333 0.33333333]

naive = np.exp(z) / np.sum(np.exp(z))
print(naive)        # [nan nan nan]  with a runtime warning
```

Three equal logits should be a uniform distribution. The naive version cannot tell you
that, and the stable version can, at the cost of one subtraction.
