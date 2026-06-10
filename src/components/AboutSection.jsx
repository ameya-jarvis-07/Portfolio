function SectionHeading({ children, className = '' }) {
  return <h2 className={`section-heading ${className}`}>{children}</h2>;
}

export default function AboutSection({ about, skillBars, education, certifications, heroImage }) {
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
          <h3 className="about-tile-title">{about.profileName}</h3>
          <p className="about-tile-subtitle">{about.profileTitle}</p>
          <p className="about-tile-bio">
            {about.bio}
          </p>
          <div className="about-pill-row">
            <span className="about-pill">{about.location}</span>
            <span className="about-pill">{about.availability}</span>
          </div>
        </article>

        <article className="about-tile about-tile-image">
          <img src={heroImage} alt={`${about.profileName} portrait`} />
        </article>

        <article className="about-tile about-tile-craft glass card-3d reveal-right">
          <h3 className="about-tile-heading">Technical Focus</h3>
          <p className="about-tile-text">
            {about.technicalFocus}
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
              <li key={item.id || item.title}>
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
            title={`${about.locationCity || 'Location'} map`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={about.mapUrl}
          />
          <div className="about-location-overlay" />
          <div className="about-location-content">
            <p className="about-location-city">{about.locationCity}</p>
            <p className="about-location-subtitle">{about.timezone}</p>
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
          <img src={heroImage} alt={about.profileName} />
        </article>
      </div>
    </section>
  );
}
