// ProjectContent.js
const projectData = [
  {
    title: "My Website",
    time: "June 2023 - present",
    description:
      "React-based front end, Express.js and MongoDB backend, featuring a blog, user comments section.<br />" +
      "User-friendly, easy navigation, with backend efficiently handling data storage for posts, comments, and visitor info.",
    sourceCode: "https://github.com/jimchen2/My-Website",
    docs: "https://jimchen.me/en/web-dev/MERN-Stack-Conclusion",
    language: "Javascript",
  },
  {
    title: "2048 Game",
    time: "June 2023",
    description: "<b>2048:</b> Game for practicing CSS, Javascript skills.<br />",
    demo: "https://cdn.jimchen.me/6f2d8d52ecdda9ced05a68586c04067e/projects-photos/2048.html",
    language: "Javascript",
  },
  {
    title: "Secure File Sharing System",
    time: "July 2023",
    description: `File-system with Golang focusing on security, privacy, and efficiency.(like Dropbox) <br/>
    Using cryptographic methods to secure user data by encrypting it with keys derived from username and password. 
    Functions include user storing, retrieving, appending files, sharing and revoking invitations`,
    docs: "https://jimchen.me/en/web-dev/End-to-End-Secure-File-Sharing-System",
    language: "Golang",
  },
  {
    title: "AI Pacman",
    time: "June 2023 - Aug 2023",
    description: `CS188 Projects, including Search, Multiagent Search, RL, Bayes Nets and HMMs, and Machine Learning`,
    language: "Python",
  },
  {
    title: "ML-based Trash Bot",
    time: "Oct 2023 - Dec 2023",
    description: `The EE149 project is developing an ML-Based Trash Collector Bot,
     an autonomous robot that uses a YOLO v5 neural network and a Raspberry Pi for
      real-time trash detection and collection. This bot can do line following, accurate trash 
      identification, and efficient operation of a robot arm for trash pickup. My role is to 
      finetune Yolo network and implement python feedback code to work with the bot.`,
    sourceCode: "https://github.com/jimchen2/EECS-149-Final-Project",
    docs: "https://jimchen.me/en/ml/149-Final-Project",
    language: "Python, Shell",
  },
  {
    title: "Reinforcement Learning in Openai Gym",
    time: "Sep 2023 - Dec 2023",
    description: `Berkeley CS 285 course featuring 5 projects implementing different RL algorithms (model based and model free) 
    to play different games (Cartpole, Humanoid, HalfCheetah, Pacman) in Openai Gym, including Imitation Learning,
    Policy Gradients, Actor-Critic and Q Learning, Model Based RL, and Offline RL`,
    sourceCode: "https://github.com/jimchen2/cs285-reinforcement-learning",
    docs: "https://jimchen.me/en/ml/RL-Notes",
    language: "Python",
  },
  {
    title: "Whisper Video S3",
    time: "Jan 2024",
    description: `Using GPU to download models from HuggingFace to local
     to add dual subtitles videos by transcribing and translating, then writing it back and uploading to S3`,
    sourceCode: "https://github.com/jimchen2/whisper-video-s3",
    language: "Python, Bash",
  },
  {
    title: "AnonyTube",
    time: "March 2024",
    description: `A sharing platform including automatic subtitle generation using Faster Whisper and video translation 
    capabilities (English/Chinese) powered by nllb-200 with secure Argon2 password 
    hashing. It support processing different quality levels in the background, integrated dark theme,
    and one-click signup process.`,
    sourceCode: "https://github.com/jimchen2/AnonyTube",
    docs: "https://jimchen.me/en/web-dev/Coding-a-Full-Stack-Video-Platform",
    language: "Javascript, Python",
  },
  {
    title: "Docker self-hosting on AWS",
    time: "May 2024 - September 2024",
    description: `I set up around 20 open source self hosting services on AWS EC2 node with docker through the subdomains of jimchen.me
    I used Nginx for certificates. I used Lambda for monitoring. Services include Fediverse (Mastodon, Matrix, PeerTube),
    LLM frontends(LobeChat, NextChat), Gitea, Database (Postgres, MongoDB), Data Management (Metabase, NocoDB), and my 
    own Next.js apps`,
    docs: "https://jimchen.me/en/web-dev/Migrating-and-Living-on-AWS",
    language: "Python, Shell",
  },
  {
    title: "Next.js Apps",
    time: "June 2024 - July 2024",
    description: `Applications with Docker containerization and Progressive Web App (PWA): 
<br/>
<a href="https://github.com/jimchen2/linktree" style="text-decoration:  underline;">Link Tree</a> - 
Personal link platform featuring dynamic image backgrounds
<br/>
<a href="https://github.com/jimchen2/task-manager-nextjs" style="text-decoration: underline;">Task Manager</a> - 
A personal task management system powered by MongoDB with backups every 30 minutes
<br/>
<a href="https://github.com/jimchen2/vercel-bedrock" style="text-decoration: underline;">LLM Frontend with 
Amazon Bedrock</a> - A simple interface with Vercel AI for Amazon's Bedrock's LLM Models.
<br/>
<a href="https://github.com/jimchen2/s3-public-index" style="text-decoration: underline;">S3 Public Frontend</a> -
 A frontend for AWS S3 management
<br/>
I also build an <a href="https://github.com/jimchen2/my-Website" style="text-decoration: underline;">
alternative doc-like website</a>`,
    docs: "https://jimchen.me/en/web-dev/Redesigning-Website-with-Nextjs",
    language: "Typescript",
  },
  {
    title: "Markdown Parser",
    time: "June 2024 - August 2024",
    description: `A simple, clean note-taking and markdown converting tool built with NextJS, 
    featuring a backend with MongoDB & S3 Bucket for media storage. 
    Web-based with PWA support for mobile.`,
    sourceCode: "https://github.com/jimchen2/markdown-parser",
    language: "Typescript",
  },
  {
    title: "Computer Networking Projects",
    time: "Oct 2024",
    description: `Computer networking projects.  <br/>
    Project 2: Distance vector routing  <br/>
    Project 3: Pox SDN to implement TCP client`,
    language: "Python",
  },
];

export default projectData;