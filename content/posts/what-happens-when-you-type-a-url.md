---
title: What Happens When You Type a URL
date: 2025-12-08
type: [systems, web]
preview_text: A slow, careful walk from the moment you press Enter to the moment pixels appear — DNS, TCP, TLS, HTTP, and the parts that actually cost time.
---

A slow walk from pressing Enter to seeing pixels. The interesting part is not the list
of steps; it is knowing which ones cost time.

## 1. The browser turns a string into a request

Before anything on the network happens, the browser parses the URL, decides whether it
is a navigation or a reload, and checks its caches in order: memory cache, disk cache,
service worker, then the proxy. A surprising number of "page loads" never touch the
network at all.

If the URL is not in the HTTP cache, the browser needs an IP address.

## 2. DNS

The resolver checks its own cache, then asks a recursive resolver, which may ask the
root servers, the TLD servers, and the authoritative nameserver. A cold lookup is
typically 20–120 ms; a warm one is effectively free.

Two details matter more than the mechanism:

- **TTL is a trade-off.** A 30-second TTL lets you move servers quickly but throws away
  the cache benefit. A five-minute TTL is a reasonable default for a small site.
- **Use `dns-prefetch` and `preconnect` for third parties you will definitely talk to.**
  Guessing wrong wastes bandwidth; guessing right removes a full round trip from the
  critical path.

```html
<link rel="preconnect" href="https://cdn.example.com" crossorigin />
<link rel="dns-prefetch" href="https://images.example.com" />
```

## 3. TCP and TLS

The browser opens a TCP connection (one round trip for the handshake, or zero with a
warm connection) and then negotiates TLS.

| Version | Round trips before data | Notes |
| --- | --- | --- |
| TLS 1.2 | 2 | Classic |
| TLS 1.3 | 1 | 0-RTT possible on resumption |
| HTTP/3 (QUIC) | 1 | Runs over UDP, no head-of-line blocking |

For a server 50 ms away, the difference between TLS 1.2 and 1.3 is about 50 ms per new
connection — which is why connection reuse matters more than protocol choice.

## 4. The request and the first byte

The server receives something like:

```http
GET /a/least-squares-is-an-orthogonal-projection HTTP/1.1
Host: jimchen.me
Accept: text/html,application/xhtml+xml
Accept-Encoding: gzip, br
```

Time to first byte is where most of the variance lives. On a dynamic page it is the
sum of everything your code does before it writes a response — database queries,
serialization, and any HTTP call you make to yourself, which is a classic unforced
error:

```javascript
// getServerSideProps — do not do this
const res = await fetch(`${process.env.NEXT_PUBLIC_SITE}/api/posts`);
const posts = await res.json();
```

That fetch leaves the process, crosses the network stack, and comes back to a server
that is already running the code that made the call. Call the data function directly:

```javascript
import { listPosts } from "@/lib/blogData";

export async function getServerSideProps({ query }) {
  const posts = await listPosts({ page: Number(query.page) || 1 });
  return { props: { posts } };
}
```

Same data, one less round trip, and no dependency on an environment variable being
correct at runtime.

## 5. Render, then re-render

The browser parses HTML into the DOM, discovers CSS and fonts, builds the render tree,
lays out, paints, and then runs JavaScript — which usually queries the DOM, fetches more
data, and re-renders. Every layout-triggering read after a write forces a second pass.

The fix is boring and effective: load less, render the same thing on the server and the
client, and keep the JavaScript you ship on the critical path to the small part that
genuinely needs to be interactive.

## Latency budget

| Step | Typical cost | Bounded by |
| --- | --- | --- |
| DNS (cold) | 20–120 ms | Network |
| TCP + TLS 1.3 | 2 RTT | Distance |
| Time to first byte | 10 ms – 2 s | Your code |
| HTML transfer | 1–2 RTT | Size and bandwidth |
| Layout + paint | 10–200 ms | Device |

Notice that only one row is under your control, and it is the one with the widest
range. Everything else is a constant you can optimize by removing work, not by
micro-tuning.
