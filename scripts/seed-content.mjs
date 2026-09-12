#!/usr/bin/env node
/**
 * Seeds the Postgres `blogs` table from content/posts/*.md.
 *
 *   npm run seed            # upsert new/changed posts
 *   npm run seed -- --force # rewrite every local post
 *
 * Requires POSTGRESQL_URL in the environment or in .env / .env.local.
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import pg from "pg";
import { compilePost } from "../src/lib/content/compile.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content", "posts");

function readEnv() {
  for (const name of [".env.local", ".env"]) {
    const p = path.join(ROOT, name);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
      if (m && process.env[m[1]] === undefined) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    }
  }
}

readEnv();

const connectionString = process.env.POSTGRESQL_URL;
if (!connectionString) {
  console.error("POSTGRESQL_URL is not set (environment, .env or .env.local).");
  process.exit(1);
}

const force = process.argv.includes("--force");
const pool = new pg.Pool({ connectionString });

const upsert = `
  INSERT INTO blogs (blogid, title, date, type, body, word_count,
                     preview_image, preview_text, markdown_hash)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  ON CONFLICT (blogid) DO UPDATE SET
    title         = EXCLUDED.title,
    date          = EXCLUDED.date,
    type          = EXCLUDED.type,
    body          = EXCLUDED.body,
    word_count    = EXCLUDED.word_count,
    preview_image = EXCLUDED.preview_image,
    preview_text  = EXCLUDED.preview_text,
    markdown_hash = EXCLUDED.markdown_hash,
    updated_at    = CURRENT_TIMESTAMP
`;

const files = fs
  .readdirSync(CONTENT_DIR)
  .filter((f) => f.endsWith(".md"))
  .sort();

let created = 0;
let updated = 0;
let skipped = 0;

try {
  for (const file of files) {
    const source = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
    const hash = crypto.createHash("sha256").update(source).digest("hex");
    const post = compilePost(source, file.replace(/\.md$/, ""));

    const existing = await pool.query(
      "SELECT markdown_hash FROM blogs WHERE blogid = $1",
      [post.blogid]
    );
    if (!force && existing.rows[0]?.markdown_hash === hash) {
      skipped += 1;
      continue;
    }

    await pool.query(upsert, [
      post.blogid,
      post.title,
      post.date,
      post.type,
      post.body,
      post.word_count,
      post.preview_image,
      post.preview_text,
      hash,
    ]);
    if (existing.rows.length) updated += 1;
    else created += 1;
    console.log(`  ${existing.rows.length ? "updated" : "created"} ${post.blogid}  ${post.title}`);
  }
  console.log(`\nDone. created=${created} updated=${updated} unchanged=${skipped}`);
} catch (err) {
  console.error("Seed failed:", err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
