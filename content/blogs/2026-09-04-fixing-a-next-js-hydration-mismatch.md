---
title: Fixing a Next.js Hydration Mismatch Without Losing Your Mind
date: 2026-09-04
type: [web]
preview_text: The server renders one thing, the browser renders another, and React tells you about it in a wall of red. Here is the checklist I now run through in order.
---

Hydration mismatches are the most annoying class of React bug because the app *works*. The page looks right, the buttons do their job, and yet the console screams. Here is the checklist I now run through, in order, before I start changing things at random.

## What is actually happening

Server-side rendering produces an HTML string. The browser parses it and paints it. Then React runs the same component code on the client to "hydrate" that HTML into a live tree. If the client tree differs from the server tree, React patches the DOM and logs a warning.

So the rule is simple to state and hard to follow: **the first client render must produce exactly what the server produced.**

## The usual suspects

### 1. Anything that reads the clock or the locale

```jsx
// Bad: the server's timezone and the browser's timezone are often different.
<span>{new Date(post.date).toLocaleDateString()}</span>

// Good: format once on the server and ship the string.
export async function getServerSideProps() {
  const post = await getPost(id);
  return {
    props: {
      formattedDate: new Date(post.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC", // pin it, or the output depends on the machine
      }),
    },
  };
}
```

Pinning `timeZone` matters more than people expect. A server in UTC and a browser in UTC+8 can disagree about what day it is for eight hours a day.

### 2. `window` and `localStorage` during the first render

```jsx
function ThemeLabel() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  // Server render and first client render both return the placeholder.
  if (!ready) return <span style={{ width: "4rem", display: "inline-block" }} />;
  return <span>{document.documentElement.dataset.theme}</span>;
}
```

The placeholder keeps the layout stable so the real content does not shift things around when it lands.

### 3. Random keys and ids

`Math.random()` in a `key`, `useId()` used inconsistently, or an auto-incrementing counter in module scope will all drift between server and client. If you need an id on both sides, derive it from the data.

### 4. Browser extensions

Before you refactor anything, open the page in a private window with extensions disabled. Grammar checkers and translators rewrite the DOM, and React blames your code for it. This is embarrassing often enough that it deserves a spot on the checklist.

## Debugging trick: compare the two trees

Render the component to a string on the server and diff it against the browser's initial HTML:

```js
import { renderToString } from "react-dom/server";

const serverHtml = renderToString(<App initialProps={props} />);
console.log(serverHtml);
```

Paste the browser's HTML next to it and diff. In nine cases out of ten the difference is one attribute — a missing `class`, a `style` that only exists on one side, or a `&nbsp;` that one side escaped differently.

## The rule I keep on a sticky note

> Deterministic in, deterministic out. Every input to the first render must come from props.

Anything else — the clock, the viewport, storage, the network, a random number — belongs in an effect, after hydration is complete.

## Related

- [React docs: Hydration](https://react.dev/reference/react-dom/client/hydrateRoot)
- My earlier note on why I stopped reading `localStorage` in `useState` initializers
