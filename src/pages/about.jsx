import React from "react";
import {
  FaEnvelope,
  FaLinkedin,
  FaGithub,
  FaTelegram,
  FaInstagram,
  FaWeixin,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";

// --- DATA ---
const data = {
  photosHeading: "A Glimpse Into My Life",
  photosDescription: "Here are a few personal photos.",
  personalPhotos: [
    { src: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/1.jpeg", thumb: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/thumbs/1-thumb.jpeg", alt: "Personal photo 1" },
    { src: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/2.JPEG", thumb: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/thumbs/2-thumb.jpeg", alt: "Personal photo 2" },
    { src: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/3.JPEG", thumb: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/thumbs/3-thumb.jpeg", alt: "Personal photo 3" },
    { src: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/4.JPEG", thumb: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/thumbs/4-thumb.jpeg", alt: "Personal photo 4" },
    { src: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/5.JPEG", thumb: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/thumbs/5-thumb.jpeg", alt: "Personal photo 5" },
  ],

  techSetupHeading: "Tech Journey",
  // FIXED: This was empty in your snippet
  techSetup: [
    { name: "Computer Configs", url: "https://github.com/jimchen2/computer-config", description: "My personal configurations for using Linux and browser userscripts. I use Fedora on Thinkpad and have a backup Windows on Redmibook." },
  ],

  culturesHeading: "Exploring Internet & Cultures",
  culturesDescription: "Besides tech, I am deeply interested in different cultures and exploring the global internet.",
  globalInternet: [
    { name: "My Guide to the Global Internet (2025)", url: "https://jimchen.me/a/19b074", description: "This personal guide maps out the global Internet across US, China, Europe, including platforms for social media, videos, messaging, search." },
  ],

  projectsHeading: "Projects & Builds",
  projects: [
    { title: "YouTube Dual Subtitles", time: "Feb 2025", description: "<a href='https://github.com/jimchen2/youtube-dual-subtitles'>Source Code</a>" },
    { title: "Computer Networking Projects", time: "Oct 2024", description: "Computer networking projects.<br>Project 2: Distance vector routing<br>Project 3: Pox SDN to implement TCP client<br><br>" },
    { title: "Web Hoarding Attempts", time: "August 2024 - October 2024", description: "Web Hoarding Attempts<br><a href='https://jimchen.me/a/efabac'>Project Details</a><br><a href='https://github.com/jimchen2/archived-scripts/tree/master/douban-scraping-main'>Douban Scraping</a><br>Bulk downloaded videos from YouTube channels. Processed 400 GB (1,360 hours) of content using OpenAI Whisper, Helsinki NLP, and ffmpeg to embed subtitles on Vast AI, then uploaded to S3. Scraped Douban discussions for 170k comments into a searchable site." },
    { title: "Markdown Doc Management", time: "June 2024 - August 2024", description: "A simple, clean note-taking and markdown converting tool built with NextJS, featuring a backend with MongoDB & S3 Bucket for media storage. Web-based with PWA support for mobile.<br><br><a href='https://github.com/jimchen2/markdown-parser'>Source Code</a>" },
    { title: "Next.js Apps", time: "June 2024 - July 2024", description: "Applications with Docker containerization and Progressive Web App (PWA):<br><br><a href='https://github.com/jimchen2/linktree'>Link Tree</a> - Personal link platform featuring dynamic image backgrounds<br><a href='https://github.com/jimchen2/task-manager-nextjs'>Task Manager</a> - A personal task management system powered by MongoDB with backups every 30 minutes<br><a href='https://github.com/jimchen2/vercel-bedrock'>LLM Frontend with Amazon Bedrock</a> - A simple interface with Vercel AI for Amazon's Bedrock's LLM Models<br><a href='https://github.com/jimchen2/s3-public-index'>S3 Public Frontend</a> - A frontend for AWS S3 management<br>" },
    { title: "Docker self-hosting on AWS", time: "May 2024 - September 2024", description: "I set up around 20 open source self hosting services on AWS EC2 node with docker through the subdomains of jimchen.me. I used Nginx for certificates. I used Lambda for monitoring. Services include Fediverse (Mastodon, Matrix, PeerTube), LLM frontends (LobeChat, NextChat), Gitea, Database (Postgres, MongoDB), Data Management (Metabase, NocoDB), and my own Next.js apps.<br><br><a href='https://github.com/jimchen2/cloud-setup'>Source Code</a>" },
    { title: "AnonyTube", time: "March 2024", description: "A sharing platform including automatic subtitle generation using Faster Whisper and video translation capabilities (English/Chinese) powered by nllb-200 with secure Argon2 password hashing. It support processing different quality levels in the background, integrated dark theme, and one-click signup process.<br><br><a href='https://github.com/jimchen2/AnonyTube'>Source Code</a> | <a href='https://jimchen.me/a/3638d8'>Building a Full Stack Video Platform</a>" },
    { title: "Reinforcement Learning in Openai Gym", time: "Sep 2023 - Dec 2023", description: "Berkeley CS 285 course featuring 5 projects implementing different RL algorithms (model based and model free) to play different games (Cartpole, Humanoid, HalfCheetah, Pacman) in Openai Gym, including Imitation Learning, Policy Gradients, Actor-Critic and Q Learning, Model Based RL, and Offline RL.<br><br><a href='https://github.com/jimchen2/cs285-reinforcement-learning'>Source Code</a> | <a href='https://jimchen.me/a/b1574a'>Policy Gradients</a> | <a href='https://jimchen.me/a/154058'>Q Learning and SAC</a> | <a href='https://jimchen.me/a/c29987'>Offline RL</a>" },
    { title: "ML-based Cleaning Bot", time: "Oct 2023 - Dec 2023", description: "The EE149 project is developing an ML-Based Trash Collector Bot, an autonomous robot that uses a YOLO v5 neural network and a Raspberry Pi for real-time trash detection and collection. This bot can do line following, accurate trash identification, and efficient operation of a robot arm for trash pickup. My role is to finetune Yolo network and implement python feedback code to work with the bot.<br><br><a href='https://github.com/jimchen2/EECS-149-Final-Project'>Source Code</a>" },
    { title: "AI Pacman", time: "June 2023 - Aug 2023", description: "CS188 Projects, including Search, Multiagent Search, RL, Bayes Nets and HMMs, and Machine Learning.<br><br>" },
    { title: "Secure File Sharing System", time: "July 2023", description: "File-system with Golang focusing on security, privacy, and efficiency (like Dropbox). Using cryptographic methods to secure user data by encrypting it with keys derived from username and password. Functions include user storing, retrieving, appending files, sharing and revoking invitations.<br><br><a href='https://jimchen.me/a/418191'>End to End Secure File Sharing System</a>" },
    { title: "My Website", time: "June 2023", description: "React-based front end, Express.js and MongoDB backend, featuring a blog, user comments section, with backend efficiently handling data storage for posts, comments.<br/> <a href='http://jimchen.me/a/3f773b'>MERN Stack Conclusion</a> <br/> <a href='http://jimchen.me/a/bf98b2'>Moving My Website to Next.js</a><br><br><a href='https://github.com/jimchen2/old-website-react'>Old React Version</a> | <a href='https://github.com/jimchen2/jimchen.me'>Current Next.js Version</a>" },
    { title: "2048 Game", time: "June 2023", description: "Game for practicing CSS, Javascript skills<br><br><a href='https://github.com/jimchen2/archived-scripts/tree/master/2048'>Source Code</a>" },
    { title: "C Language Generals.io Game", time: "Nov 2021", description: "<a href='https://github.com/jimchen2/archived-scripts/tree/master/202111-generals.io'>Source Code</a> | <a href='https://jimchen.me/a/940e56'>Project Details</a>" }
  ],
};

const LINKS = [
  { label: "Profile", items: [
      { name: "Email", url: "mailto:jimchen4214@gmail.com", icon: FaEnvelope, color: "#EA4335" },
      { name: "LinkedIn", url: "https://www.linkedin.com/in/jim-chen-588002255/", icon: FaLinkedin, color: "#0077B5" },
      { name: "GitHub", url: "https://github.com/jimchen2", icon: FaGithub, color: "#333" },
    ]
  },
  { label: "Contact", items: [
      { name: "Telegram", url: "https://t.me/Jimchen4214", icon: FaTelegram, color: "#0088cc" },
      { name: "Instagram", url: "https://www.instagram.com/jimchen_1", icon: FaInstagram, color: "#E4405F" },
      { name: "WeChat", url: "https://jimchen.me/weixin.jpg", icon: FaWeixin, color: "#07C160" },
    ]
  },
  { label: "Social Media", items: [
      { name: "YouTube", url: "https://www.youtube.com/@jimchen4214", icon: FaYoutube, color: "#FF0000" },
      { name: "TikTok", url: "https://www.tiktok.com/@jimchen.me", icon: FaTiktok, color: "#000" },
    ]
  },
];

// --- STYLES ---
const s = {
  layout: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    background: "#f7f8fc",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  page: { flex: 1, padding: "2rem 1rem 3rem" },
  container: { maxWidth: "1200px", margin: "0 auto", padding: "1rem" },
  card: {
    background: "white",
    borderRadius: "0",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
    marginBottom: "2rem",
  },
  bar: { background: "linear-gradient(135deg, #93c5fd 0%, #6ee7b7 100%)", height: "6px" },
  gradient: {
    background: "linear-gradient(135deg, #60a5fa 0%, #34d399 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    display: "inline-block",
  },
  header: { display: "flex", alignItems: "center", marginBottom: "1rem" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem" },
  twoCol: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "2rem" },
};

// --- COMPONENTS ---
const ThemeSwitcher = () => null; // Placeholder for your theme switcher

const Card = ({ children }) => (
  <div style={s.card}>
    <div style={s.bar} />
    <div style={{ padding: "2rem" }}>{children}</div>
  </div>
);

const Header = ({ emoji, title }) => (
  <div style={s.header}>
    <span style={{ fontSize: "2rem", marginRight: "0.8rem" }}>{emoji}</span>
    <h3 style={{ ...s.gradient, fontSize: "1.4rem", fontWeight: "700", margin: 0 }}>{title}</h3>
  </div>
);

const Link = ({ item }) => {
  if (item.links) {
    return (
      <li style={{ marginBottom: "1rem" }}>
        {item.links.map((link, idx) => (
          <div key={idx} style={{ marginBottom: idx < item.links.length - 1 ? "0.5rem" : "0" }}>
            <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", fontSize: "1.15rem", fontWeight: "600" }}>
              {link.name}
            </a>
          </div>
        ))}
        {item.description && <p style={{ margin: "0.5rem 0 0 0", fontSize: "1.1rem", color: "#475569", fontWeight: "600" }}>{item.description}</p>}
      </li>
    );
  }

  return (
    <li style={{ marginBottom: "1rem" }}>
      <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", fontSize: "1.15rem", fontWeight: "600" }}>
        {item.name}
      </a>
      {item.description && <p style={{ margin: "0.25rem 0 0 0", fontSize: "1.05rem", color: "#475569", fontWeight: "600" }}>{item.description}</p>}
    </li>
  );
};

const Photo = ({ photo }) => (
  <a href={photo.src} target="_blank" rel="noopener noreferrer" title={photo.alt} style={{ display: "block", border: "1px solid #e2e8f0", overflow: "hidden" }}>
    <img src={photo.thumb || photo.src} alt={photo.alt} loading="lazy" style={{ width: "100%", height: "180px", objectFit: "cover", display: "block" }} />
  </a>
);

const Bottombar = () => (
  <footer style={{ display: "flex", justifyContent: "center", background: "#e9ecef", padding: "1.5rem 4rem", width: "100%", marginTop: "auto", boxShadow: "0 -4px 24px rgba(0,0,0,0.05)" }}>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", justifyContent: "space-between", alignItems: "center", width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
      {LINKS.map(({ label, items }) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <span style={{ fontWeight: 600, color: "#5a6068", fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: 1 }}>{label}</span>
          <div style={{ display: "flex", gap: "0.85rem" }}>
            {items.map(({ name, url, icon: Icon, color }) => (
              <a key={name} href={url} target="_blank" rel="noopener noreferrer" title={name} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 42, height: 42, borderRadius: 10, background: color, color: "#fff", textDecoration: "none" }}>
                <Icon size={17} />
              </a>
            ))}
          </div>
        </div>
      ))}
      <ThemeSwitcher />
    </div>
  </footer>
);

// --- MAIN PAGE ---
export default function AboutPage() {
  return (
    <div style={s.layout}>
      <div style={s.page}>
        <div style={s.container}>
          
          {/* Photos Section */}
          <Card>
            <Header emoji="📸" title={data.photosHeading} />
            <p style={{ marginBottom: "1.5rem", color: "#475569", fontSize: "1.2rem", fontWeight: "600" }}>
              {data.photosDescription}
            </p>
            <div style={s.grid}>
              {data.personalPhotos.map((p, i) => (
                <Photo key={i} photo={p} />
              ))}
            </div>
          </Card>

          {/* Tech and Culture Section */}
          <div style={s.twoCol}>
            <Card>
              <Header emoji="⚙️" title={data.techSetupHeading} />
              <ul style={{ listStyle: "disc", paddingLeft: "1.5rem", margin: 0 }}>
                {data.techSetup.map((item, i) => (
                  <Link key={i} item={item} />
                ))}
              </ul>
            </Card>
            <Card>
              <Header emoji="🌍" title={data.culturesHeading} />
              <p style={{ marginBottom: "1.5rem", color: "#475569", fontSize: "1.1rem", fontWeight: "600" }}>
                {data.culturesDescription}
              </p>
              <ul style={{ listStyle: "disc", paddingLeft: "1.5rem", margin: 0 }}>
                {data.globalInternet.map((item, i) => (
                  <Link key={i} item={item} />
                ))}
              </ul>
            </Card>
          </div>

          {/* Projects Section */}
          <Card>
            <Header emoji="💻" title={data.projectsHeading} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1rem' }}>
              {data.projects.map((proj, idx) => (
                <div key={idx} style={{ borderBottom: idx !== data.projects.length - 1 ? "1px solid #e2e8f0" : "none", paddingBottom: idx !== data.projects.length - 1 ? "1.5rem" : "0" }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: "wrap", marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0, fontSize: "1.25rem", color: "#1e293b" }}>{proj.title}</h4>
                    <span style={{ fontSize: "0.95rem", color: "#64748b", fontWeight: "600" }}>{proj.time}</span>
                  </div>
                  <div 
                    style={{ fontSize: "1.05rem", color: "#475569", lineHeight: "1.6" }} 
                    dangerouslySetInnerHTML={{ __html: proj.description }} 
                  />
                </div>
              ))}
            </div>
          </Card>

        </div>
      </div>
      
      {/* Footer / Links */}
      <Bottombar />
    </div>
  );
}