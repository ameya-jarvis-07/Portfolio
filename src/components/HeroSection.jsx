function StatCard({ value, label }) {
  return (
    <div className="glass stat-card card-3d reveal-scale">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function HeroSection({ resumeUrl, heroImage }) {
  return (
    <section id="home" className="section section-hero">
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="hero-eyebrow reveal-up">AI & Data Science</p>

          <h1 className="hero-title animate-float reveal-up delay-1">
            Ameya Ramteke
            <br />
            <span className="text-gradient-shimmer">AI & DS Engineer</span>
          </h1>

          <p className="hero-subtitle reveal-up delay-2">
            Building intelligent solutions with Python, Machine Learning, and Cloud Architecture.
          </p>

          <div className="hero-buttons reveal-up delay-3">
            <a href="#projects" className="btn btn-primary">
              View Projects
            </a>
            <a href={resumeUrl} target="_blank" rel="noreferrer" className="btn btn-outline">
              Download Resume
            </a>
          </div>
        </div>

        <div className="hero-panel glass-strong card-3d reveal-scale">
          <div className="hero-profile">
            <div className="hero-profile-glow" />
            <img src={heroImage} alt="Ameya Ramteke" />
          </div>

          <div>
            <p className="hero-panel-title">Quick highlights</p>
            <ul className="hero-panel-list">
              <li>AI/ML and data analysis focus</li>
              <li>Cloud architecture and full-stack builds</li>
              <li>Open to internships and collaborations</li>
            </ul>
          </div>

          <div className="hero-panel-stats">
            <div className="stats-grid">
              <StatCard value="4+" label="Major Projects" />
              <StatCard value="5+" label="Certifications" />
              <StatCard value="Team" label="Lead & Rep" />
              <StatCard value="AI/DS" label="Specialization" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
