#!/usr/bin/env node
// scripts/smoke.mjs
// End-to-end checks against a running instance of the site.
//
//   node scripts/smoke.mjs [baseUrl]      (default http://localhost:3000)
//
// These hit the real HTTP endpoints, so they exercise getServerSideProps, the
// post repository, the Markdown/KaTeX pipeline and the API handlers.

const BASE = (process.argv[2] || process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");

let passed = 0;
const failures = [];

function check(name, condition, detail = "") {
  if (condition) {
    passed += 1;
    console.log(`  ok   ${name}`);
  } else {
    failures.push(`${name}${detail ? ` — ${detail}` : ""}`);
    console.log(`  FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

async function get(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, { redirect: "manual", ...options });
  const contentType = res.headers.get("content-type") || "";
  const body = contentType.includes("json")
    ? await res.json()
    : await res.text();
  return { status: res.status, body, headers: res.headers, location: res.headers.get("location") };
}

async function post(path, payload) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  let body = null;
  try {
    body = await res.json();
  } catch {
    /* non-JSON response */
  }
  return { status: res.status, body };
}

const run = async () => {
  console.log(`Smoke testing ${BASE}\n`);

  // --- Home page ---------------------------------------------------------
  console.log("Home page");
  const home = await get("/");
  check("GET / returns 200", home.status === 200, `got ${home.status}`);
  check("home page lists posts", home.body.includes("/a/"));
  check("home page shows tag filters", home.body.includes("Filter By Tags"));
  check("home page has an RSS link", home.body.includes('type="application/rss+xml"'));

  // The post list must include at least one journal and one code/math post.
  const preview = await get("/api/blog/preview?count=50");
  check("preview API returns 200", preview.status === 200, `got ${preview.status}`);
  const posts = preview.body?.data ?? [];
  check("preview API returns posts", posts.length >= 5, `${posts.length} posts`);

  const mathPost = posts.find((p) => (p.type || []).includes("math"));
  const codePost = posts.find((p) => p.blogid.includes("hydration"));
  const journalPost = posts.find((p) => (p.type || []).includes("journal"));
  check("a math post exists", Boolean(mathPost));
  check("a code post exists", Boolean(codePost));
  check("a journal post exists", Boolean(journalPost));
  check(
    "preview dates are formatted",
    /^[A-Z][a-z]{2} \d{2}, \d{4}$/.test(posts[0]?.date ?? ""),
    posts[0]?.date,
  );
  check("word counts are computed", posts.every((p) => p.word_count > 100));

  // --- Filtering, search, pagination ------------------------------------
  console.log("\nFiltering and search");
  if (mathPost) {
    const filtered = await get(`/api/blog/preview?type=${encodeURIComponent(mathPost.type[0])}`);
    const allMatch = (filtered.body.data || []).every((p) =>
      p.type.includes(mathPost.type[0]),
    );
    check("type filter only returns matching posts", allMatch);
    check("type filter returns something", filtered.body.data.length > 0);
  }

  const search = await get("/?searchterm=gradient");
  check("search page returns 200", search.status === 200);
  check("search highlights matches", search.body.includes("<mark>"));

  const badSearch = await get(`/?searchterm=${encodeURIComponent("[unterminated")}`);
  check("regex-special search term does not crash", badSearch.status === 200);

  const pageOne = await get("/api/blog/preview?count=3");
  const pageTwo = await get("/api/blog/preview?count=3&start=3");
  check(
    "pagination offsets work",
    pageOne.body.data[0]?.blogid !== pageTwo.body.data[0]?.blogid,
  );

  const overflow = await get("/?page=9999");
  check("page beyond the end redirects", [301, 302, 307, 308].includes(overflow.status),
    `got ${overflow.status}`);

  // --- Single post: math --------------------------------------------------
  console.log("\nPost rendering");
  if (mathPost) {
    const page = await get(`/a/${mathPost.blogid}`);
    check("math post returns 200", page.status === 200, `got ${page.status}`);
    check("math post has KaTeX CSS hook", page.body.includes("katex"));
    // The KaTeX HTML is injected server-side, so it is in the initial markup.
    check("math slot is server-rendered", page.body.includes('class="math-slot"'));
    check("KaTeX output is present", /class="katex(-display)?"/.test(page.body));
    check("a fraction actually rendered", page.body.includes("mfrac"));
    check(
      "no formula failed to compile",
      !page.body.includes("katex-error"),
      "a TeX expression in content/ is invalid",
    );
    check("math post has a table of contents", page.body.includes("Table of contents"));
    check("math post has JSON-LD", page.body.includes("application/ld+json"));
  }

  // --- Single post: code --------------------------------------------------
  if (codePost) {
    const page = await get(`/a/${codePost.blogid}`);
    check("code post returns 200", page.status === 200, `got ${page.status}`);
    check("code post renders a code block", page.body.includes("code-block"));
    check("code block shows its language", page.body.includes("code-block-language"));
    // The old renderer deleted every double quote from code; this is the regression test.
    check(
      "double quotes survive inside code blocks",
      page.body.includes("toLocaleDateString(&quot;en-US&quot;") ||
        page.body.includes('toLocaleDateString("en-US"'),
    );
    check(
      "angle brackets survive inside code blocks",
      page.body.includes("&lt;span") || page.body.includes("<span"),
    );
  }

  // --- 404 ----------------------------------------------------------------
  const missing = await get("/a/this-post-does-not-exist");
  check("unknown post returns 404", missing.status === 404, `got ${missing.status}`);

  // --- Interactions -------------------------------------------------------
  console.log("\nLikes, views and comments");
  const target = mathPost || posts[0];

  const likeState = await get(`/api/blog/likes?blogid=${target.blogid}`);
  check("likes GET returns a token", typeof likeState.body?.token === "string");

  // Likes are a toggle, so assert against the state we started from rather than
  // assuming "liked" — that keeps the suite re-runnable.
  const wasLiked = likeState.body?.liked === true;

  const liked = await post(`/api/blog/likes?blogid=${target.blogid}`, {
    token: likeState.body.token,
  });
  check("like POST succeeds", liked.status === 200, `got ${liked.status}`);
  check("like POST flips the state", liked.body?.liked === !wasLiked);

  const afterLike = await get(`/api/blog/likes?blogid=${target.blogid}`);
  check("like state is remembered for this IP", afterLike.body?.liked === !wasLiked);

  // Put it back so repeated runs see the same starting point.
  await post(`/api/blog/likes?blogid=${target.blogid}`, { token: likeState.body.token });

  const badLike = await post(`/api/blog/likes?blogid=${target.blogid}`, { token: "nope" });
  check("forged like token is rejected", badLike.status === 403, `got ${badLike.status}`);

  const viewState = await get(`/api/blog/views?blogid=${target.blogid}`);
  const recorded = await post(`/api/blog/views?blogid=${target.blogid}`, {
    token: viewState.body.token,
  });
  check("view POST succeeds", recorded.status === 200, `got ${recorded.status}`);
  check("view counter increased", recorded.body?.views >= 1);

  const beforeComments = await get(`/api/comment?blogid=${target.blogid}`);
  check("comments GET returns an array", Array.isArray(beforeComments.body));

  const uuid = crypto.randomUUID().replace(/-/g, "");
  const created = await post("/api/comment", {
    user: "smoke test",
    text: "Automated smoke test comment.",
    blog: target.blogid,
    uuid,
    parentid: null,
  });
  check("comment POST returns 201", created.status === 201, `got ${created.status}`);

  const afterComments = await get(`/api/comment?blogid=${target.blogid}`);
  check(
    "new comment appears in the list",
    afterComments.body.some((c) => c.uuid === uuid),
  );

  const badComment = await post("/api/comment", { blog: target.blogid, text: "x" });
  check("comment without a uuid is rejected", badComment.status === 400, `got ${badComment.status}`);

  // --- Feeds --------------------------------------------------------------
  console.log("\nFeeds");
  const rss = await get("/api/rss");
  check("RSS returns 200", rss.status === 200, `got ${rss.status}`);
  check("RSS contains /a/ permalinks", rss.body.includes(`/a/${target.blogid}`));
  check("RSS has no undefined URLs", !rss.body.includes("undefined"));

  const sitemap = await get("/sitemap.xml");
  check("sitemap returns 200", sitemap.status === 200, `got ${sitemap.status}`);
  check("sitemap is XML", sitemap.body.startsWith("<?xml"));
  check("sitemap lists posts", sitemap.body.includes(`/a/${target.blogid}`));

  // --- Static pages -------------------------------------------------------
  console.log("\nStatic pages");
  const about = await get("/about");
  check("about page returns 200", about.status === 200, `got ${about.status}`);
  check("about page has a title tag", /<title[^>]*>About/.test(about.body));

  const robots = await get("/robots.txt");
  check("robots.txt mentions the sitemap", robots.body.includes("Sitemap:"));

  // --- Summary ------------------------------------------------------------
  console.log(`\n${passed} passed, ${failures.length} failed`);
  if (failures.length > 0) {
    console.log("\nFailures:");
    failures.forEach((f) => console.log(`  - ${f}`));
    process.exit(1);
  }
};

run().catch((err) => {
  console.error("\nSmoke test crashed:", err);
  process.exit(1);
});
