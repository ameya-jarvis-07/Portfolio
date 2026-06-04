import React from 'react';
import { Mail, Github, Linkedin, ExternalLink } from 'lucide-react';

const resumeUrl = new URL('../../Assets/Resume.pdf', import.meta.url).href;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="brand-logo">JARVIS</div>
            <div className="brand-title">Ameya Ramteke</div>
            <div className="brand-sub">AI · Data · Web</div>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-list">
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href={resumeUrl} target="_blank" rel="noreferrer">Resume</a></li>
            </ul>
          </div>

          <div className="footer-contact-col">
            <h4 className="footer-heading">Contact</h4>
            <ul className="contact-list">
              <li><a href="mailto:ameyaramteke07.work@gmail.com" target="_blank" rel="noreferrer noopener"><Mail className="contact-icon-inline" /> Email</a></li>
              <li><a href="https://github.com/ameya-jarvis-07" target="_blank" rel="noreferrer noopener"><Github className="contact-icon-inline" /> GitHub</a></li>
              <li><a href="https://www.linkedin.com/in/ameya-jarvis-07/" target="_blank" rel="noreferrer noopener"><Linkedin className="contact-icon-inline" /> LinkedIn</a></li>
              <li><a href="https://linktr.ee/ameya_jarvis" target="_blank" rel="noreferrer noopener"><ExternalLink className="contact-icon-inline" /> LinkTree</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-meta">
          <small>© {year} Ameya Ramteke. All rights reserved.</small>
        </div>
      </div>
    </footer>
  );
}
