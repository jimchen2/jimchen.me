import React from "react";
import { MapPin, Mail, Phone, ExternalLink, GraduationCap } from "lucide-react";
import { FaGithub, FaLinkedin, FaYoutube, FaTiktok, FaInstagram } from "react-icons/fa";

const links = {
  github: "https://github.com/jimchen2",
  linkedin: "https://www.linkedin.com/in/jim-chen-588002255/",
  email: "mailto:jimchen4214@gmail.com",
  phone: "tel:4793169630",
  instagram: "https://www.instagram.com/hijimchen/",
  youtube: "https://www.youtube.com/@jimchen4214",
  tiktok: "https://www.tiktok.com/@jimchen.me",
  languages: "https://jimchen.me/?type=languages",
  reading: "https://jimchen.me/?type=reading",
  hefei: "https://jimchen.me/?type=hefei",
  shanghai: "https://jimchen.me/?type=shanghai",
  alaska: "https://jimchen.me/?type=alaska",
  hongkong: "https://jimchen.me/?type=hong-kong",
  bayarea: "https://jimchen.me/?type=bayarea",
  russia: "https://jimchen.me/?type=trip-ru-25",
};

const images = {
  vertical1: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/public_images/profile/profile_image_resized.jpg",
  horizontal: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/public_images/profile/2.jpeg",
};

const SocialLink = ({ href, label, icon: Icon }) => (
  <a href={href} target="_blank" rel="noreferrer" className="social-chip">
    {Icon && <Icon size={16} />}
    <span>{label}</span>
    <ExternalLink size={14} className="arrow-icon" />
  </a>
);

export default function App() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        * { box-sizing: border-box; }

        body {
          margin: 0;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          line-height: 1.6;
        }

        .page-container {
          max-width: 680px;
          margin: 0 auto;
          padding: 5rem 1.5rem;
        }

        h1 {
          font-family: 'Caveat', cursive;
          font-size: 4.25rem;
          margin: 0 0 0.5rem;
        }

        .bio {
          font-size: 1.2rem;
          font-weight: 500;
          line-height: 1.5;
          margin-bottom: 2rem;
          opacity: 0.95;
        }

        .meta-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.25rem;
          margin-bottom: 2.5rem;
          padding: 1.5rem;
          border-radius: 16px;
          border: 1px solid currentColor;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.95rem;
        }

        .meta-item svg, .arrow-icon { flex-shrink: 0; }

        .contact-link {
          color: inherit;
          text-decoration: none;
          font-weight: 500;
        }

        .section-title {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 700;
          margin-bottom: 0.85rem;
          opacity: 0.7;
        }

        .chips-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 3rem;
        }

        .chips-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .social-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.65rem 1.35rem;
          border: 1px solid currentColor;
          border-radius: 10px;
          color: inherit;
          font-size: 0.9rem;
          font-weight: 500;
          text-decoration: none;
          transition: transform 0.2s ease;
        }

        .social-chip:hover {
          transform: translateY(-2px);
        }

        /* Blogs Section Finetuning */
        .blog-list {
          list-style: none;
          padding: 0;
          margin: 0 0 3.5rem 0;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .blog-list li {
          font-size: 1.05rem;
          font-weight: 400;
          line-height: 1.6;
          display: flex;
          align-items: baseline;
          gap: 0.6rem;
        }

        .blog-list li::before {
          content: "•";
          font-size: 1.2rem;
          opacity: 0.5;
        }

        .blog-list a {
          color: inherit;
          font-weight: 600;
          text-decoration: underline;
          text-decoration-color: rgba(0, 0, 0, 0.3);
          text-underline-offset: 4px;
          transition: text-decoration-color 0.2s ease, opacity 0.2s ease;
        }

        .blog-list a:hover {
          text-decoration-color: currentColor;
          opacity: 0.8;
        }

        .gallery {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .gallery-item {
          overflow: hidden;
          border-radius: 20px;
          border: 1px solid currentColor;
          width: 100%;
        }

        .gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }

        .gallery-item:hover img { transform: scale(1.025); }

        .aspect-16-9 { aspect-ratio: 16 / 9; }
        .aspect-9-16 { aspect-ratio: 9 / 16; max-width: 420px; margin: 0 auto; }

        @media (max-width: 600px) {
          .page-container { padding: 3rem 1.25rem; }
          h1 { font-size: 3.5rem; }
        }
      `}</style>

      <div className="page-container">
        <header>
          <h1>jim chen</h1>
          <br />
          <p className="bio">
            CS grad student at the University of Arkansas (AR-kən-saw) from Shanghai. I am passionate about blogging, media, traveling, language learning, and meeting new people. Other side hobbies: cooking, outdoors, listening to
            folk music, and reading poetry.
          </p>
        </header>

        <div className="meta-grid">
          <div className="meta-item">
            <MapPin size={18} />
            <span>Fayetteville, AR</span>
          </div>

          <div className="meta-item">
            <GraduationCap size={18} />
            <span>
              Undergrad: USTC (Hefei, China) <br /> School of the Gifted Young
            </span>
          </div>

          <div className="meta-item">
            <Mail size={18} />
            <a href={links.email} className="contact-link">
              jimchen4214@gmail.com
            </a>
          </div>

          <div className="meta-item">
            <Phone size={18} />
            <a href={links.phone} className="contact-link">
              (479) 316-9630
            </a>
          </div>
        </div>

        <section>
          <div className="section-title">Work and Social Media</div>
          <div className="chips-wrapper">
            <div className="chips-row">
              <SocialLink href={links.github} label="GitHub" icon={FaGithub} />
              <SocialLink href={links.linkedin} label="LinkedIn" icon={FaLinkedin} />
            </div>
            <div className="chips-row">
              <SocialLink href={links.youtube} label="YouTube" icon={FaYoutube} />
              <SocialLink href={links.tiktok} label="TikTok" icon={FaTiktok} />
              <SocialLink href={links.instagram} label="Instagram" icon={FaInstagram} />
            </div>
          </div>
        </section>

        <section>
          <div className="section-title">Blogs & Writing</div>
          <ul className="blog-list">
            <li>
              <span>
                Check out my{" "}
                <a href={links.languages} target="_blank" rel="noreferrer">
                  language learning blogs about Spanish and Russian
                </a>
              </span>
            </li>
            <li>
              <span>
                <a href={links.hefei} target="_blank" rel="noreferrer">
                  Walking around in Hefei
                </a>
                , where I spent my undergrad years
              </span>
            </li>
            <li>
              <span>
                <a href={links.russia} target="_blank" rel="noreferrer">
                  Solo Backpacking in Russia and Belarus
                </a>
              </span>
            </li>
            <li>
              <span>
                <a href={links.alaska} target="_blank" rel="noreferrer">
                  Solo Trip to Alaska
                </a>
              </span>
            </li>
            <li>
              <span>
                My brief summer in{" "}
                <a href={links.hongkong} target="_blank" rel="noreferrer">
                  Hong Kong
                </a>
              </span>
            </li>
            <li>
              <span>
                Exchange year in Berkeley and exploring the{" "}
                <a href={links.bayarea} target="_blank" rel="noreferrer">
                  Bay Area
                </a>
              </span>
            </li>
            <li>
              <span>
                Walking around in my native{" "}
                <a href={links.shanghai} target="_blank" rel="noreferrer">
                  Shanghai
                </a>
              </span>
            </li>
            <li>
              <span>
                My{" "}
                <a href={links.reading} target="_blank" rel="noreferrer">
                  YA book reviews
                </a>{" "}
                from middle school
              </span>
            </li>
          </ul>
        </section>

        <div className="gallery">
          <div className="gallery-item aspect-9-16">
            <img src={images.vertical1} alt="Jim Chen Vertical" />
          </div>
          <div className="gallery-item aspect-16-9">
            <img src={images.horizontal} alt="Jim Chen Horizontal" />
          </div>
        </div>
      </div>
    </>
  );
}
