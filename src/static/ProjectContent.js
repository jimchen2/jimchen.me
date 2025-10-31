// ProjectContent.js
const projectData = [
  {
    title: "YouTube Dual Subtitles",
    time: "Feb 2025",
    description: "<a href='https://github.com/jimchen2/youtube-dual-subtitles'>Source Code</a>"
  },
  {
    title: "Computer Networking Projects",
    time: "Oct 2024",
    description:
      "Computer networking projects.<br>" +
      "Project 2: Distance vector routing<br>" +
      "Project 3: Pox SDN to implement TCP client<br><br>"
  },
  {
    title: "Web Hoarding Attempts",
    time: "August 2024 - October 2024",
    description:
      "Web Hoarding Attempts<br>" +
      "<a href='https://jimchen.me/a/efabac'>Project Details</a><br>" +
      "<a href='https://github.com/jimchen2/archived-scripts/tree/master/douban-scraping-main'>Douban Scraping</a><br>" +
      "<a href='https://github.com/jimchen2/archived-scripts/tree/master/Learn-Russian/prev'>Learn Russian</a><br><br>" +
      "Bulk downloaded videos from YouTube channels. Processed 400 GB (1,360 hours) of content using OpenAI Whisper, " +
      "Helsinki NLP, and ffmpeg to embed subtitles on Vast AI, then uploaded to S3. Scraped Douban discussions for 170k comments into a searchable site."
  },
  {
    title: "Markdown Doc Management",
    time: "June 2024 - August 2024",
    description:
      "A simple, clean note-taking and markdown converting tool built with NextJS, " +
      "featuring a backend with MongoDB & S3 Bucket for media storage. " +
      "Web-based with PWA support for mobile.<br><br>" +
      "<a href='https://github.com/jimchen2/markdown-parser'>Source Code</a>"
  },
  {
    title: "Next.js Apps",
    time: "June 2024 - July 2024",
    description:
      "Applications with Docker containerization and Progressive Web App (PWA):<br><br>" +
      "<a href='https://github.com/jimchen2/linktree'>Link Tree</a> - " +
      "Personal link platform featuring dynamic image backgrounds<br>" +
      "<a href='https://github.com/jimchen2/task-manager-nextjs'>Task Manager</a> - " +
      "A personal task management system powered by MongoDB with backups every 30 minutes<br>" +
      "<a href='https://github.com/jimchen2/vercel-bedrock'>LLM Frontend with " +
      "Amazon Bedrock</a> - A simple interface with Vercel AI for Amazon's Bedrock's LLM Models<br>" +
      "<a href='https://github.com/jimchen2/s3-public-index'>S3 Public Frontend</a> - " +
      "A frontend for AWS S3 management<br>"
  },
  {
    title: "Docker self-hosting on AWS",
    time: "May 2024 - September 2024",
    description:
      "I set up around 20 open source self hosting services on AWS EC2 node with docker through the subdomains of jimchen.me. " +
      "I used Nginx for certificates. I used Lambda for monitoring. Services include Fediverse (Mastodon, Matrix, PeerTube), " +
      "LLM frontends (LobeChat, NextChat), Gitea, Database (Postgres, MongoDB), Data Management (Metabase, NocoDB), and my " +
      "own Next.js apps.<br><br>" +
      "<a href='https://github.com/jimchen2/cloud-setup'>Source Code</a>"
  },
  {
    title: "AnonyTube",
    time: "March 2024",
    description:
      "A sharing platform including automatic subtitle generation using Faster Whisper and video translation " +
      "capabilities (English/Chinese) powered by nllb-200 with secure Argon2 password " +
      "hashing. It support processing different quality levels in the background, integrated dark theme, " +
      "and one-click signup process.<br><br>" +
      "<a href='https://github.com/jimchen2/AnonyTube'>Source Code</a> | " +
      "<a href='https://jimchen.me/a/3638d8'>Building a Full Stack Video Platform</a>"
  },
  {
    title: "Reinforcement Learning in Openai Gym",
    time: "Sep 2023 - Dec 2023",
    description:
      "Berkeley CS 285 course featuring 5 projects implementing different RL algorithms (model based and model free) " +
      "to play different games (Cartpole, Humanoid, HalfCheetah, Pacman) in Openai Gym, including Imitation Learning, " +
      "Policy Gradients, Actor-Critic and Q Learning, Model Based RL, and Offline RL.<br><br>" +
      "<a href='https://github.com/jimchen2/cs285-reinforcement-learning'>Source Code</a> | " +
      "<a href='https://jimchen.me/a/b1574a'>Policy Gradients</a> | " +
      "<a href='https://jimchen.me/a/154058'>Q Learning and SAC</a> | " +
      "<a href='https://jimchen.me/a/c29987'>Offline RL</a>"
  },
  {
    title: "ML-based Cleaning Bot",
    time: "Oct 2023 - Dec 2023",
    description:
      "The EE149 project is developing an ML-Based Trash Collector Bot, " +
      "an autonomous robot that uses a YOLO v5 neural network and a Raspberry Pi for " +
      "real-time trash detection and collection. This bot can do line following, accurate trash " +
      "identification, and efficient operation of a robot arm for trash pickup. My role is to " +
      "finetune Yolo network and implement python feedback code to work with the bot.<br><br>" +
      "<a href='https://github.com/jimchen2/EECS-149-Final-Project'>Source Code</a>"
  },
  {
    title: "AI Pacman",
    time: "June 2023 - Aug 2023",
    description:
      "CS188 Projects, including Search, Multiagent Search, RL, Bayes Nets and HMMs, and Machine Learning.<br><br>"
  },
  {
    title: "Secure File Sharing System",
    time: "July 2023",
    description:
      "File-system with Golang focusing on security, privacy, and efficiency (like Dropbox). " +
      "Using cryptographic methods to secure user data by encrypting it with keys derived from username and password. " +
      "Functions include user storing, retrieving, appending files, sharing and revoking invitations.<br><br>" +
      "<a href='https://jimchen.me/a/418191'>End to End Secure File Sharing System</a>"
  },
  {
    title: "My Website",
    time: "June 2023",
    description:
      "React-based front end, Express.js and MongoDB backend, featuring a blog, user comments section, with backend efficiently handling data storage for posts, comments." +
      "<br/> <a href='http://jimchen.me/a/3f773b'>MERN Stack Conclusion</a> " +
      "<br/> <a href='http://jimchen.me/a/bf98b2'>Moving My Website to Next.js</a><br><br>" +
      "<a href='https://github.com/jimchen2/old-website-react'>Old React Version</a> | " +
      "<a href='https://github.com/jimchen2/jimchen.me'>Current Next.js Version</a>"
  },
  {
    title: "2048 Game",
    time: "June 2023",
    description:
      "<b>2048:</b> Game for practicing CSS, Javascript skills<br><br>" +
      "<a href='https://github.com/jimchen2/archived-scripts/tree/master/2048'>Source Code</a>"
  },
  {
    title: "C Language Generals.io Game",
    time: "Nov 2021",
    description:
      "<a href='https://github.com/jimchen2/archived-scripts/tree/master/202111-generals.io'>Source Code</a> | " +
      "<a href='https://jimchen.me/a/940e56'>Project Details</a>"
  }
];

export default projectData;