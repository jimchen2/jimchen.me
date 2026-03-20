import React from "react";

const links = {
  blog: "https://jimchen.me/",
  github: "https://github.com/jimchen2",
  linkedin: "https://www.linkedin.com/in/jim-chen-588002255/",
  telegram: "https://t.me/Jimchen4214",
  instagram: "https://www.instagram.com/jimchen_1",
  wechat: "https://jimchen.me/weixin.jpg",
  youtube: "https://www.youtube.com/@jimchen4214",
};

const A = ({ href, children }) => (
  <a href={href} target="_blank" rel="noreferrer">
    {children}
  </a>
);

const Section = ({ title, children }) => (
  <div style={{ marginBottom: "1.5rem" }}>
    <h2 style={{ borderBottom: "1px solid #ccc", paddingBottom: "4px", marginBottom: "0.75rem" }}>
      {title}
    </h2>
    {children}
  </div>
);

const Li = ({ children }) => (
  <li style={{ marginBottom: "0.4rem", lineHeight: "1.6" }}>{children}</li>
);

export default function App() {
  return (
    <div
      style={{
        maxWidth: "720px",
        margin: "0 auto",
        padding: "2rem 1rem",
        fontFamily: "sans-serif",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ marginBottom: "0.25rem" }}>jimchen.me</h1>
      <p style={{ marginBottom: "0.25rem" }}>
        <A href={links.github}>GitHub</A> &nbsp;·&nbsp;
        <A href={links.linkedin}>LinkedIn</A>
      </p>
      <p style={{ marginBottom: "1.5rem" }}>
        <A href={links.telegram}>Telegram</A> &nbsp;·&nbsp;
        <A href={links.instagram}>Instagram</A> &nbsp;·&nbsp;
        <A href={links.wechat}>WeChat</A> &nbsp;·&nbsp;
        <A href={links.youtube}>YouTube</A> &nbsp;
      </p>

      {/* ── Photos ── */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          marginBottom: "1.5rem",
          height: "280px",
        }}
      >
        {/* tall / portrait */}
        <img
          src="https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/1.jpeg"
          alt="Portrait"
          style={{
            flex: 1,
            width: 0,
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
        {/* 16:9 / landscape */}
        <img
          src="https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/2.JPEG"
          alt="Landscape"
          style={{
            flex: 2.5,
            width: 0,
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      </div>

      <hr style={{ marginBottom: "1.5rem" }} />

      <Section title="Education">
        <ul style={{ paddingLeft: "1.25rem", margin: 0 }}>
          <Li>
            <strong>B.Eng, Computer Science</strong> — University of Science and Technology of China (2021.9–2026.6)
          </Li>
          <Li>
            <strong>Visiting Student, CS</strong> — UC Berkeley (2023.1–2023.12)
          </Li>
        </ul>
      </Section>

      <Section title="Projects & Blogs">
        <ul style={{ paddingLeft: "1.25rem", margin: 0 }}>
          <Li>
            <strong>Reading Git 0.0.1 Source Code</strong> | <A href="https://jimchen.me/a/80ef80">Blog</A> (2025.4)
          </Li>
          <Li>
            <strong>YouTube Dual Subtitles</strong>: Chrome extension for language learning. |{" "}
            <A href="https://chromewebstore.google.com/detail/youtube-dual-subtitles/kicgaahncmjpbgokkckmgglblgpjokmb">Extension</A>{" "}
            | <A href="https://github.com/jimchen2/youtube-dual-subtitles">Source Code</A> (2025.2)
          </Li>
          <Li>
            <strong>Computer Networking Projects</strong>: CS168 — distance vector routing, Pox SDN, TCP client. (2024.10)
          </Li>
          <Li>
            <strong>Web Hoarding Attempts</strong>: 400 GB (1360 hrs) from YouTube. |{" "}
            <A href="https://jimchen.me/a/efabac">Blog</A> (2024.8–2024.10)
          </Li>
          <Li>
            <strong>Docker self-hosting on AWS</strong>: 20 open-source services on EC2. |{" "}
            <A href="https://github.com/jimchen2/cloud-setup">Source Code</A> (2024.5–2024.9)
          </Li>
          <Li>
            <strong>Next.js PWA Apps</strong> |{" "}
            <A href="https://github.com/jimchen2/archived-scripts/tree/master/linktree-main">Link Tree</A> |{" "}
            <A href="https://github.com/jimchen2/task-manager-nextjs">Task Manager</A> |{" "}
            <A href="https://github.com/jimchen2/vercel-bedrock">LLM Frontend</A> |{" "}
            <A href="https://github.com/jimchen2/s3-public-index">S3 Frontend</A> |{" "}
            <A href="https://github.com/jimchen2/markdown-parser">Markdown Docs</A> (2024.6–2024.8)
          </Li>
          <Li>
            <strong>Moving My Website to Next.js</strong> |{" "}
            <A href="https://github.com/jimchen2/jimchen.me">Source Code</A> |{" "}
            <A href="http://jimchen.me/a/bf98b2">Blog</A> (2024.5)
          </Li>
          <Li>
            <strong>Exploring BSD, PostmarketOS, LineageOS</strong> |{" "}
            <A href="https://jimchen.me/a/0db501">PostMarketOS</A> |{" "}
            <A href="https://jimchen.me/a/35c93c">BSD Wireless</A> |{" "}
            <A href="https://jimchen.me/a/e99e99">LineageOS</A> (2024.3–2024.4)
          </Li>
          <Li>
            <strong>AnonyTube</strong>: Multi-user video platform with Fast Whisper subtitles & nllb-200. |{" "}
            <A href="https://github.com/jimchen2/AnonyTube">Source Code</A> |{" "}
            <A href="https://jimchen.me/a/3638d8">Blog</A> (2024.3)
          </Li>
          <Li>
            <strong>Reinforcement Learning (CS285)</strong>: 5 projects incl. Actor-Critic, Q-Learning, Model-Based RL. |{" "}
            <A href="https://github.com/jimchen2/cs285-reinforcement-learning">Source Code</A> |{" "}
            <A href="https://jimchen.me/a/b1574a">Policy Gradients</A> |{" "}
            <A href="https://jimchen.me/a/154058">Q Learning</A> |{" "}
            <A href="https://jimchen.me/a/c29987">Offline RL</A> (2023.9–2023.12)
          </Li>
          <Li>
            <strong>ML-based Cleaning Bot</strong>: CS149 group project, YOLO v5 trash identification. |{" "}
            <A href="https://github.com/jimchen2/EECS-149-Final-Project">Source Code</A> (2023.10–2023.12)
          </Li>
          <Li>
            <strong>End-to-End Secure File Sharing</strong>: CS161 — Golang filesystem with sharing & revocation. |{" "}
            <A href="https://jimchen.me/a/418191">Blog</A> (2023.7)
          </Li>
          <Li>
            <strong>My Old Website</strong>: MERN stack blog with comments. |{" "}
            <A href="https://github.com/jimchen2/old-website-react">Source Code</A> |{" "}
            <A href="http://jimchen.me/a/3f773b">Blog</A> (2023.6)
          </Li>
          <Li>
            <strong>2048 Game</strong>: CSS & JS practice. |{" "}
            <A href="https://github.com/jimchen2/archived-scripts/tree/master/2048">Source Code</A> (2023.6)
          </Li>
          <Li>
            <strong>Generals.io GUI in C</strong> |{" "}
            <A href="https://github.com/jimchen2/archived-scripts/tree/master/202111-generals.io">Source Code</A>{" "}
            | <A href="https://jimchen.me/a/940e56">Blog</A> (2021.11)
          </Li>
        </ul>
      </Section>

      <Section title="Computer Config">
        <h3>Userscripts</h3>
        <ul style={{ paddingLeft: "1.25rem", margin: "0 0 1rem" }}>
          {[
            "video-sites-shortcuts.user.js",
            "annoying-websites.user.js",
            "youtube-subtitles-only.user.js",
          ].map((name) => (
            <Li key={name}>
              <A href={`https://github.com/jimchen2/jimchen2/raw/refs/heads/main/userscripts/${name}`}>
                <code>{name}</code>
              </A>
            </Li>
          ))}
        </ul>

        <h3>Telegram</h3>
        <ul style={{ paddingLeft: "1.25rem", margin: "0 0 1rem" }}>
          <Li>
            <A href="https://github.com/jimchen2/telegram-bot">telegram-bot</A>
          </Li>
        </ul>

        <h3>ibus</h3>
        <pre
          style={{
            background: "#f5f5f5",
            padding: "1rem",
            borderRadius: "6px",
            overflowX: "auto",
            fontSize: "0.85rem",
            lineHeight: "1.6",
          }}
        >
          {`rm -rf ~/.local/share/ibus-typing-booster/
rm -rf ~/.cache/ibus/libpinyin/
ibus reset-config
gsettings set com.github.libpinyin.ibus-libpinyin.libpinyin remember-every-input false
gsettings set com.github.libpinyin.ibus-libpinyin.libpinyin dynamic-adjust false
gsettings set com.github.libpinyin.ibus-libpinyin.libpinyin clear-user-data true
ibus restart`}
        </pre>
      </Section>

      Synced from https://github.com/jimchen2/jimchen2
    </div>
  );
}
