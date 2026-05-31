function SectionHeading({ children, className = '' }) {
  return <h2 className={`section-heading ${className}`}>{children}</h2>;
}

export default function AboutSection({ skillBars, education, certifications, heroImage }) {
  const skillTags = skillBars.map((skill) => skill.label);

  return (
    <section id="about" className="section about-template">
      <div className="about-template-header">
        <SectionHeading>
          About <span className="text-gradient-shimmer">Me</span>
        </SectionHeading>
      </div>

      <div className="about-template-grid">
        <article className="about-tile about-tile-profile glass card-3d reveal-left">
          <p className="about-tile-eyebrow">Profile</p>
          <h3 className="about-tile-title">Ameya Ramteke</h3>
          <p className="about-tile-subtitle">AI & Data Science Engineer</p>
          <p className="about-tile-bio">
            AI/DS engineer building ML pipelines, data products, and cloud-native apps that ship fast.
          </p>
          <div className="about-pill-row">
            <span className="about-pill">Nagpur, India</span>
            <span className="about-pill">Open to work</span>
          </div>
        </article>

        <article className="about-tile about-tile-image">
          <img src={heroImage} alt="Ameya Ramteke portrait" />
        </article>

        <article className="about-tile about-tile-craft glass card-3d reveal-right">
          <h3 className="about-tile-heading">Technical Focus</h3>
          <p className="about-tile-text">
            Focused on AI/ML, analytics, and production-ready full-stack builds with a cloud-first mindset.
          </p>
          <div className="about-pill-row about-pill-row-wrap">
            {skillTags.map((tag) => (
              <span key={tag} className="about-pill about-pill-outline">
                {tag}
              </span>
            ))}
          </div>
        </article>

        <article className="about-tile about-tile-education glass card-3d reveal-up">
          <h3 className="about-tile-heading">Education</h3>
          <ul className="about-list">
            {education.map((item) => (
              <li key={item.title}>
                <span className="about-list-title">{item.title}</span>
                <span className="about-list-subtitle">{item.place}</span>
                {item.status ? <span className="about-list-status">{item.status}</span> : null}
              </li>
            ))}
          </ul>
        </article>

        <article className="about-tile about-tile-location">
          <iframe
            className="about-location-map"
            title="Nagpur map"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.openstreetmap.org/export/embed.html?bbox=79.0506%2C21.1200%2C79.1106%2C21.1800&layer=mapnik&marker=21.150037219633752%2C79.08060139999999"
          />
          <div className="about-location-overlay" />
          <div className="about-location-content">
            <p className="about-location-city">Nagpur</p>
            <p className="about-location-subtitle">GMT+5:30</p>
          </div>
        </article>

        <article className="about-tile about-tile-mindset glass card-3d reveal-left">
          <h3 className="about-tile-heading">Certifications</h3>
          <ul className="about-list about-list-compact">
            {certifications.map((item) => (
              <li key={item}>
                <span className="about-list-title">{item}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="about-tile about-tile-center">
          <img src={heroImage} alt="Ameya Ramteke" />
        </article>
      </div>
    </section>
  );
}
