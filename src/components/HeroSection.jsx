function StatCard({ value, label }) {
  return (
    <div className="glass stat-card card-3d reveal-scale">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function HeroSection({ hero, resumeUrl, heroImage }) {
  return (
    <section id="home" className="section section-hero">
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="hero-eyebrow reveal-up">{hero.eyebrow}</p>

          <h1 className="hero-title animate-float reveal-up delay-1">
            {hero.name}
            <br />
            <span className="text-gradient-shimmer">{hero.title}</span>
          </h1>

          <p className="hero-subtitle reveal-up delay-2">
            {hero.subtitle}
          </p>

          <div className="hero-buttons reveal-up delay-3">
            <a href="#projects" className="btn btn-primary">
              {hero.buttons.primaryLabel}
            </a>
            <a href={resumeUrl} target="_blank" rel="noreferrer" className="btn btn-outline">
              {hero.buttons.secondaryLabel}
            </a>
          </div>
        </div>

        <div className="hero-panel glass-strong card-3d reveal-scale">
          <div className="hero-profile">
            <div className="hero-profile-glow" />
            <img src={heroImage} alt={hero.name} />
          </div>

          <div>
            <p className="hero-panel-title">Quick highlights</p>
            <ul className="hero-panel-list">
              {hero.highlights.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="hero-panel-stats">
            <div className="stats-grid">
              {hero.stats.map((stat) => (
                <StatCard key={stat.id} value={stat.value} label={stat.label} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
