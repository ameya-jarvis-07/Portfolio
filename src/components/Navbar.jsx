import { FileText, Home, Mail, Menu, User, Code2, X, Sun, Moon } from 'lucide-react';

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'about', label: 'About', icon: User },
  { id: 'projects', label: 'Projects', icon: Code2 },
  { id: 'contact', label: 'Contact', icon: Mail },
];

export default function Navbar({
  activeSection,
  menuOpen,
  onToggleMenu,
  onCloseMenu,
  resumeUrl,
  theme,
  onToggleTheme,
}) {
  return (
    <>
      <nav className="navbar" role="navigation" aria-label="Main navigation">
        <div className="navbar-inner">
          <div className="navbar-pill" role="menubar" aria-label="Primary">
            {navItems.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className={`nav-pill-link${activeSection === id ? ' active' : ''}`}
                aria-current={activeSection === id ? 'page' : undefined}
              >
                {label}
              </a>
            ))}
            <a href={resumeUrl} target="_blank" rel="noreferrer" className="nav-pill-link nav-pill-action">
              Resume
            </a>
          </div>

          <div className="navbar-actions">
            <button
              type="button"
              className="theme-toggle"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-pressed={theme === 'dark'}
              onClick={onToggleTheme}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? <Sun style={{ width: 20, height: 20 }} /> : <Moon style={{ width: 20, height: 20 }} />}
            </button>

            {/* Hamburger */}
            <button
              type="button"
              className="hamburger"
              aria-label="Toggle mobile menu"
              aria-expanded={menuOpen}
              onClick={onToggleMenu}
            >
              <Menu style={{ width: 24, height: 24 }} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      <div
        className={`mobile-overlay${menuOpen ? ' open' : ''}`}
        onClick={onCloseMenu}
        aria-hidden="true"
      />

      {/* Mobile Menu */}
      <div
        className={`mobile-menu${menuOpen ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="mobile-menu-header">
          <div className="navbar-logo">
            <span className="bracket">&lt;</span>MENU<span className="bracket">/&gt;</span>
          </div>
          <button type="button" className="close-btn" aria-label="Close menu" onClick={onCloseMenu}>
            <X style={{ width: 24, height: 24 }} />
          </button>
        </div>

        <nav className="mobile-nav-links">
          {navItems.map(({ id, label, icon: Icon }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={onCloseMenu}
              className={`mobile-nav-link${activeSection === id ? ' active' : ''}`}
            >
              <Icon />
              <span>{label}</span>
            </a>
          ))}
          <a href={resumeUrl} target="_blank" rel="noreferrer" onClick={onCloseMenu} className="mobile-nav-link">
            <FileText />
            <span>Resume</span>
          </a>
        </nav>

        <div className="mobile-menu-footer">
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
            © {new Date().getFullYear()} Ameya Ramteke
          </p>
        </div>
      </div>
    </>
  );
}
