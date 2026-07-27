import React from "react";
import { MapPin, Mail, Phone, ExternalLink } from "lucide-react";
import {
  FaGithub,
  FaLinkedin,
  FaYoutube,
  FaTiktok,
  FaInstagram,
} from "react-icons/fa";

const links = {
  github: "https://github.com/jimchen2",
  linkedin: "https://www.linkedin.com/in/jim-chen-588002255/",
  email: "mailto:jimchen4214@gmail.com",
  phone: "tel:4793169630",
  instagram: "https://www.instagram.com/hijimchen/",
  youtube: "https://www.youtube.com/@jimchen4214",
  tiktok: "https://www.tiktok.com/@jimchen.me",
};

const images = {
  vertical1:
    "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/public_images/profile/profile_image_resized.jpg",
  horizontal:
    "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/public_images/profile/2.jpeg",
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
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Plus+Jakarta+Sans:wght@400;500;700&display=swap');

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
          margin: 0 0 2rem;
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
          flex-wrap: wrap;
          gap: 0.6rem;
          margin-bottom: 3rem;
        }

        .social-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.9rem;
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
        </header>

        <div className="meta-grid">
          <div className="meta-item">
            <MapPin size={18} />
            <span>
              Fayetteville, AR 
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
            <SocialLink href={links.github} label="GitHub" icon={FaGithub} />
            <SocialLink href={links.linkedin} label="LinkedIn" icon={FaLinkedin} />
            <SocialLink href={links.youtube} label="YouTube" icon={FaYoutube} />
            <SocialLink href={links.tiktok} label="TikTok" icon={FaTiktok} />
            <SocialLink href={links.instagram} label="Instagram" icon={FaInstagram} />
          </div>
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
