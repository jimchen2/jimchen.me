import React from "react";

// --- Introduction Section ---
export const introHeading = "Hello there, I'm Jim Chen";

export const introductionPoints = [
  "I am from Shanghai.",
  "I am a student in University of Science and Technology of China (USTC) in Computer Science, School of Gifted Young.",
  "I have been to UC Berkeley for an exchange year in 2023.",
  "I am fluent in English (primary), Mandarin (native), and Russian.",
];

// NEW: Hobbies section data
export const hobbies = [
  "I enjoy walking in the city and visiting shopping malls.",
  "I clean my room every week.",
  <>
    I like watching YouTube. I've collected and organized videos into{" "}
    <a href="https://www.youtube.com/@jimchen4214/playlists" target="_blank" rel="noopener noreferrer">
      playlists
    </a>
    .
  </>,
];

export const otherFacts = [
  "From 2014 to 2021, I participated in math competitions before entering USTC.",
  "In 2016 and 2020, I was into reciting Ci poetry and memorized about a hundred poems.",
  <>
    From 2016 to 2022 I liked reading English literature. See my{" "}
    <a href="https://www.goodreads.com/user/show/154371677-jim-chen" target="_blank" rel="noopener noreferrer">
      Goodreads
    </a>
    .
  </>,
  "In 2022 I began seriously use a smartphone, and watch YouTube heavily in English, then in other languages.",
];

// --- Photos Section ---
export const photosHeading = "A Glimpse Into My Life";
export const photosDescription = "Here are a few personal photos.";
export const personalPhotos = [
  {
    src: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/1.jpeg",
    thumb: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/thumbs/1-thumb.jpeg",
    alt: "Personal photo 1",
  },
  {
    src: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/2.JPEG",
    thumb: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/thumbs/2-thumb.jpeg",
    alt: "Personal photo 2",
  },
  {
    src: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/3.JPEG",
    thumb: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/thumbs/3-thumb.jpeg",
    alt: "Personal photo 3",
  },
  {
    src: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/4.JPEG",
    thumb: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/thumbs/4-thumb.jpeg",
    alt: "Personal photo 4",
  },
  {
    src: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/5.JPEG",
    thumb: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/thumbs/5-thumb.jpeg",
    alt: "Personal photo 5",
  },
];

// --- Tech & Cultures Section ---
export const techSetupHeading = "Tech Journey";
export const techSetupDescription =
  "As a tech enthusiast, I enjoy exploring different technologies and learning new tools.";
export const techSetup = [
  {
    name: "Computer Configs",
    url: "https://github.com/jimchen2/computer-config",
    description:
      "My personal configurations for using Linux and browser extensions. I mostly use Fedora on my Thinkpad and have a backup Windows on Redmibook.",
  },
  {
    name: "My Website Source Code",
    url: "https://github.com/jimchen2/jimchen.me",
    description: "This website is created with Next.js framework, my previous website was created in 2022 in Wix..",
  },
  {
    name: "Dual Subtitles on YouTube",
    url: "https://github.com/jimchen2/youtube-dual-subtitles",
    description: "A browser extension to display dual subtitles on YouTube to help language learning.",
  },

  {
    name: "More Projects",
    url: "https://jimchen.me/projects",
    description: "My personal projects, experiments, and things I've worked on.",
  },
];

export const culturesHeading = "Exploring Internet & Cultures";
export const culturesDescription =
  "Besides tech, I am deeply interested in different cultures and exploring the global internet.";

export const globalInternet = [
  {
    links: [
      { name: "Russian Culture and Media (2024-2025)", url: "https://jimchen.me/a/1580c8" },
      { name: "German Culture and Media (2025)", url: "https://jimchen.me/a/7d67cb" },
    ],
    description:
      "Exploring modern media and culture across different regions, including music, entertainment, geography, history, news. My goal is to understand YouTube and Telegram directly and watch news, TV shows, interviews, athletes, and singers without filters.",
  },
  {
    name: "My Guide to the Global Internet (2025)",
    url: "https://jimchen.me/a/19b074",
    description:
      "This personal guide maps out the global Internet across US, China, Russia, EU, including platforms for social media, videos, messaging, search.",
  },
];
// --- Connect Section ---
export const connectHeading = "Connect With Me";
export const connectIntroPoints = [
  <>
    I primarily use{" "}
    <a href="https://t.me/jimchenme" target="_blank" rel="noopener noreferrer">
      Telegram
    </a>
    ,{" "}
    <a href="https://www.instagram.com/jimchen.me" target="_blank" rel="noopener noreferrer">
      Instagram
    </a>
    , and{" "}
    <a href="https://jimchen.me/weixin.jpg" target="_blank" rel="noopener noreferrer">
      WeChat
    </a>{" "}
    for communication and updates.
  </>,
  <>
    I have a{" "}
    <a href="https://www.youtube.com/@jimchen4214" target="_blank" rel="noopener noreferrer">
      YouTube channel
    </a>
    .
  </>,
  <>
    I share my thoughts on my{" "}
    <a href="http://jimchen.me" target="_blank" rel="noopener noreferrer">
      personal blog
    </a>
    , mostly in English and around 200k words.
  </>,
];
