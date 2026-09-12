---
blogid: 30be58
title: I Rebuilt the Blog Again (This Time It Is Boring)
date: 2026-09-10
type: [web, tech, journal]
---

Every developer eventually rebuilds their blog, and every developer's rebuild is a confession. Mine is this: my blog was held together by one regular expression that silently ate every double quote in my code samples, and I noticed only because a reader emailed me that my Python looked "stylized".

This post is a short tour of what broke and what I changed. No new framework, no new database, no excitement. Boring is the goal.

## The quote-eating regex

To swap plain `<pre>` blocks for a React component with a copy button, old code did this:

```javascript
const processedText = text.replace(
  /<pre><code class="(language-\w+)">(.*?)<\/code><\/pre>/gs,
  (match, language, code) => `<codeblock code="${code.replace(/"/g, "")}"></codeblock>`
);
```

Two bugs in one line. First, `code.replace(/"/g, "")` deletes every `"` character, because at some past midnight I was fighting an attribute-escaping problem and solved it by deleting the evidence. Second, the non-greedy `(.*?)` stops at the first `</code>`, so any code sample containing a string with that text in it truncates the block.

The fix is to stop doing string surgery on HTML and let the parser do its job:

```javascript
const elements = parse(body, {
  replace: (domNode) => {
    if (domNode.name === "pre") {
      const codeNode = (domNode.children || []).find((c) => c.name === "code");
      if (!codeNode) return;
      const lang = (codeNode.attribs?.class || "").match(/language-([\w+#-]+)/);
      const code = codeNode.children
        .filter((c) => c.type === "text")
        .map((c) => c.data)
        .join("");
      return <CodeBlock code={code} language={lang ? lang[1] : null} />;
    }
  },
});
```

The parser hands me text nodes with entities already decoded. No regex, no deleted quotes, no truncation. If you are reading this and your blog does string surgery on its own HTML: stop, it is eating your quotes too.

## A database you can say no to

The blog runs on Postgres (Neon), which is great until the connection string is missing in some environment and every page becomes a stack trace. The data layer now has two backends behind one interface:

```sql
-- the only query the fallback has to match, semantically
SELECT blogid, title, date, type, body, word_count, preview_image, preview_text
FROM blogs
WHERE $1 = ANY(type)
ORDER BY date DESC
LIMIT $2 OFFSET $3;
```

If `POSTGRESQL_URL` is set and connects, we use Postgres. If it is missing, or the pool errors, we fall back to markdown files compiled at boot with the exact same row shape. The site never white-screens because of infrastructure; it just quietly serves the local copy. Likes, views and comments degrade to "off" instead of throwing.

## Math that renders on the server

Posts are markdown now, and math is compiled with KaTeX at build time instead of hoping a client-side script runs after hydration:

```text
$$ \sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6} $$
```

That becomes real markup in the HTML response, so readers see formulas even with JavaScript disabled, and search engines see text instead of a flash of `$\LaTeX$`.

## What I did not change

- The CSS rules at the top of the README: natural link underlines, instant state changes, sharp edges, system typography. They are the entire visual identity and they cost nothing.
- Postgres as the source of truth in production. The markdown fallback is a safety net, not a migration.
- The URL scheme. `/a/[blogid]` forever. Cool URLs don't change.

The whole thing is on GitHub. If you find a quote missing from a code sample, email me; I owe you one already.
