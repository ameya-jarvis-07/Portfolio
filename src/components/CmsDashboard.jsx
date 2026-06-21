import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Download,
  LogOut,
  Plus,
  RotateCcw,
  Shield,
  Trash2,
  Upload,
  X,
  Monitor,
  Phone,
  RotateCw,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  CONTACT_ICON_OPTIONS,
  PROJECT_ACCENT_OPTIONS,
  PROJECT_ICON_OPTIONS,
  SKILL_COLOR_OPTIONS,
} from '../data/portfolioContent';

function Field({ label, children, hint }) {
  return (
    <label className="cms-field">
      <span className="cms-field__label">{label}</span>
      {children}
      {hint ? <span className="cms-field__hint">{hint}</span> : null}
    </label>
  );
}

function TextInput(props) {
  return <input className="cms-input" {...props} />;
}

function TextArea(props) {
  return <textarea className="cms-input cms-textarea" {...props} />;
}

function Select({ children, ...props }) {
  return (
    <select className="cms-input" {...props}>
      {children}
    </select>
  );
}

function SectionCard({ title, subtitle, action, children }) {
  return (
    <section className="cms-card glass">
      <div className="cms-card__header">
        <div>
          <h3 className="cms-card__title">{title}</h3>
          {subtitle ? <p className="cms-card__subtitle">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function makeId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function createBlankProject() {
  return {
    id: makeId('project'),
    title: 'New Project',
    description: 'Describe the project here.',
    tags: ['Tag 1', 'Tag 2'],
    accent: 'cyan',
    iconKey: 'file-text',
    link: 'https://example.com',
    image: '',
    deleted: false
  };
}

function createBlankSkill() {
  return { id: makeId('skill'), label: 'New Skill', value: 50, color: 'cyan', deleted: false };
}

function createBlankEducation() {
  return { id: makeId('education'), title: 'New Education Item', place: 'Institution', status: '', deleted: false };
}

function createBlankCertification() {
  return { id: makeId('cert'), label: 'New Certification', deleted: false };
}

function createBlankContactLink() {
  return {
    id: makeId('contact'),
    iconKey: 'mail',
    title: 'Link Title',
    text: 'Link text',
    href: 'https://example.com',
    deleted: false
  };
}

function createBlankFooterLink() {
  return { id: makeId('footer'), label: 'Link Label', href: '#home', deleted: false };
}

function createBlankSocialLink() {
  return { id: makeId('social'), iconKey: 'github', label: 'Social Link', href: 'https://example.com', deleted: false };
}

function parseJsonFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        resolve(JSON.parse(String(reader.result || '{}')));
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Could not read file.'));
    reader.readAsText(file);
  });
}

function cloneDraft(value) {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value));
}

export default function CmsDashboard({
  open,
  authenticated,
  credentialsConfigured,
  content,
  onContentChange,
  onAuthenticate,
  onLogout,
  onClose,
  onResetToDefaults,
  fullScreen = false,
  showPreview = false,
  onTogglePreview = () => {},
  previewDevice = 'landscape',
  onPreviewDeviceChange = () => {},
  iframeRef,
  onIframeLoad
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [authForm, setAuthForm] = useState({ username: '', password: '', confirmPassword: '' });
  const [authError, setAuthError] = useState('');
  const [setupMode, setSetupMode] = useState(!credentialsConfigured);
  const [statusMessage, setStatusMessage] = useState('Changes save automatically to the server.');
  const [busy, setBusy] = useState(false);
  const fileInputRef = useRef(null);
  const viewportWrapperRef = useRef(null);
  const [portraitScale, setPortraitScale] = useState(1);

  useEffect(() => {
    if (previewDevice !== 'portrait' || !showPreview || !open) return;
    
    const wrapper = viewportWrapperRef.current;
    if (!wrapper) return;

    const updateScale = () => {
      const rect = wrapper.getBoundingClientRect();
      const availableW = rect.width;
      const availableH = rect.height;
      
      // Target dimensions for 9:16 content area:
      // Content size is 360x640.
      // Bezel is 12px on each side.
      // Total outer size is (360 + 24) x (640 + 24) = 384x664.
      const targetW = 384;
      const targetH = 664;
      
      // Compute scale to fit inside wrapper with a 16px buffer
      const buffer = 16;
      const scaleW = (availableW - buffer) / targetW;
      const scaleH = (availableH - buffer) / targetH;
      const newScale = Math.min(scaleW, scaleH, 1);
      
      setPortraitScale(newScale);
    };

    updateScale();
    
    const observer = new ResizeObserver(updateScale);
    observer.observe(wrapper);
    return () => {
      observer.disconnect();
    };
  }, [previewDevice, showPreview, open]);


  const tabs = useMemo(
    () => [
      { id: 'overview', label: 'Overview' },
      { id: 'hero', label: 'Hero' },
      { id: 'about', label: 'About' },
      { id: 'projects', label: 'Projects' },
      { id: 'contact', label: 'Contact' },
      { id: 'footer', label: 'Footer' },
      { id: 'trash', label: 'Trash Bin' },
    ],
    [],
  );

  useEffect(() => {
    if (!open) {
      setAuthError('');
    }
  }, [open]);

  useEffect(() => {
    if (authenticated) {
      setStatusMessage('Dashboard unlocked. Edit any field and the live portfolio updates immediately.');
    }
  }, [authenticated]);

  if (!open) {
    return null;
  }

  const updatePortfolio = (updater) => {
    onContentChange((current) => {
      const draft = cloneDraft(current);
      updater(draft);
      return draft;
    });
    setStatusMessage('Saved. Public content updated.');
  };

  const updateArrayItem = (path, index, nextItem) => {
    updatePortfolio((draft) => {
      const target = path.reduce((accumulator, key) => accumulator[key], draft);
      target[index] = nextItem;
    });
  };

  const setItemDeletedStatus = (path, itemId, deleted) => {
    updatePortfolio((draft) => {
      const target = path.reduce((accumulator, key) => accumulator[key], draft);
      const item = target.find((x) => x.id === itemId);
      if (item) {
        item.deleted = deleted;
      }
    });
  };

  const permanentlyDeleteArrayItem = (path, itemId) => {
    updatePortfolio((draft) => {
      const target = path.reduce((accumulator, key) => accumulator[key], draft);
      const index = target.findIndex((x) => x.id === itemId);
      if (index !== -1) {
        target.splice(index, 1);
      }
    });
  };

  const setHighlightDeletedStatus = (index, deleted) => {
    updatePortfolio((draft) => {
      const target = draft.hero.highlights[index];
      if (typeof target === 'string') {
        draft.hero.highlights[index] = { id: `highlight-${index}-${Math.random().toString(36).substring(2, 9)}`, text: target, deleted };
      } else {
        target.deleted = deleted;
      }
    });
  };

  const permanentlyDeleteHighlight = (index) => {
    updatePortfolio((draft) => {
      draft.hero.highlights.splice(index, 1);
    });
  };

  const addArrayItem = (path, createItem) => {
    updatePortfolio((draft) => {
      const target = path.reduce((accumulator, key) => accumulator[key], draft);
      target.push(createItem());
    });
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setAuthError('');
    setBusy(true);

    try {
      await onAuthenticate(authForm, setupMode);
      setAuthForm({ username: '', password: '', confirmPassword: '' });
      setStatusMessage(setupMode ? 'Admin access created.' : 'Signed in successfully.');
    } catch (error) {
      setAuthError(error.message || 'Authentication failed.');
    } finally {
      setBusy(false);
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'portfolio-content.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    try {
      const imported = await parseJsonFile(file);
      onContentChange(() => imported);
      setStatusMessage('Imported content file. Review the updated data on the public site.');
    } catch (error) {
      setAuthError('Invalid JSON file.');
    }
  };

  const hasDeletedItems = () => {
    const hasProjects = (content.projects || []).some(item => item.deleted);
    const hasSkills = (content.about?.skillBars || []).some(item => item.deleted);
    const hasEdu = (content.about?.education || []).some(item => item.deleted);
    const hasCert = (content.about?.certifications || []).some(item => item.deleted);
    const hasStats = (content.hero?.stats || []).some(item => item.deleted);
    const hasHighlights = (content.hero?.highlights || []).some(item => item && typeof item !== 'string' && item.deleted);
    const hasContact = (content.contact?.links || []).some(item => item.deleted);
    const hasFooterQuick = (content.footer?.quickLinks || []).some(item => item.deleted);
    const hasFooterSocial = (content.footer?.socialLinks || []).some(item => item.deleted);

    return hasProjects || hasSkills || hasEdu || hasCert || hasStats || hasHighlights || hasContact || hasFooterQuick || hasFooterSocial;
  };

  const renderTrashSection = (title, path, getLabel) => {
    const list = path.reduce((accumulator, key) => accumulator[key], content) || [];
    const deletedItems = list.filter((item) => item && item.deleted);

    if (deletedItems.length === 0) return null;

    return (
      <div className="cms-trash-group" style={{ marginBottom: '1.5rem' }}>
        <h4 className="cms-field__label" style={{ color: 'var(--olive)', marginBottom: '0.5rem' }}>{title}</h4>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {deletedItems.map((item) => (
            <div key={item.id} className="cms-array-item" style={{ padding: '0.6rem 0.85rem' }}>
              <div style={{ flex: 1, fontSize: '0.88rem', fontWeight: 600 }}>{getLabel(item)}</div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                  onClick={() => setItemDeletedStatus(path, item.id, false)}
                >
                  Restore
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', borderColor: '#c03030', color: '#c03030' }}
                  onClick={() => {
                    if (window.confirm(`Permanently delete this ${title.toLowerCase()} item? This cannot be undone.`)) {
                      permanentlyDeleteArrayItem(path, item.id);
                    }
                  }}
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTrashHighlights = () => {
    const list = content.hero.highlights || [];
    const deletedItems = list
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => item && typeof item !== 'string' && item.deleted);

    if (deletedItems.length === 0) return null;

    return (
      <div className="cms-trash-group" style={{ marginBottom: '1.5rem' }}>
        <h4 className="cms-field__label" style={{ color: 'var(--olive)', marginBottom: '0.5rem' }}>Hero Highlights</h4>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {deletedItems.map(({ item, index }) => (
            <div key={item.id || index} className="cms-array-item" style={{ padding: '0.6rem 0.85rem' }}>
              <div style={{ flex: 1, fontSize: '0.88rem', fontWeight: 600 }}>{item.text}</div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                  onClick={() => setHighlightDeletedStatus(index, false)}
                >
                  Restore
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', borderColor: '#c03030', color: '#c03030' }}
                  onClick={() => {
                    if (window.confirm('Permanently delete this highlight? This cannot be undone.')) {
                      permanentlyDeleteHighlight(index);
                    }
                  }}
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const projectIcons = PROJECT_ICON_OPTIONS;

  if (!authenticated) {
    return (
      <div className="cms-overlay" role="dialog" aria-modal="true" aria-label="Admin login">
        <button type="button" className="cms-backdrop" aria-label="Close admin panel" onClick={onClose} />
        <div className="cms-shell cms-shell--login glass-strong">
          <div className="cms-shell__header">
            <div>
              <p className="cms-shell__eyebrow">Private access</p>
              <h2 className="cms-shell__title">Content Management</h2>
              <p className="cms-shell__subtitle">
                Sign in to edit the live portfolio or create private admin access for this browser.
              </p>
            </div>
            <button type="button" className="cms-close" onClick={onClose} aria-label="Close admin panel">
              <X size={18} />
            </button>
          </div>

          <form className="cms-login-form" onSubmit={handleAuthSubmit}>
            <Field label="Username">
              <TextInput
                value={authForm.username}
                onChange={(event) => setAuthForm((current) => ({ ...current, username: event.target.value }))}
                autoComplete="username"
                required
              />
            </Field>
            <Field label="Password">
              <TextInput
                type="password"
                value={authForm.password}
                onChange={(event) => setAuthForm((current) => ({ ...current, password: event.target.value }))}
                autoComplete={setupMode ? 'new-password' : 'current-password'}
                required
              />
            </Field>
            {setupMode ? (
              <Field label="Confirm password">
                <TextInput
                  type="password"
                  value={authForm.confirmPassword}
                  onChange={(event) => setAuthForm((current) => ({ ...current, confirmPassword: event.target.value }))}
                  autoComplete="new-password"
                  required
                />
              </Field>
            ) : null}

            {authError ? <div className="cms-status cms-status--error">{authError}</div> : null}
            <div className="cms-status">
              {setupMode
                ? 'Create the private login you want to use on this domain.'
                : 'Enter your credentials to unlock the dashboard.'}
            </div>

            <div className="cms-actions-row">
              <button type="submit" className="btn btn-primary" disabled={busy}>
                <Shield size={16} />
                {busy ? 'Working...' : setupMode ? 'Create access' : 'Login'}
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setSetupMode((current) => !current)}>
                {setupMode ? 'I already have access' : 'Set up access'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const shellContent = (
    <div className={`cms-shell glass-strong ${fullScreen ? 'cms-shell--fullscreen' : ''}`}>
      <div className="cms-shell__header">
        <div>
          <p className="cms-shell__eyebrow">Private access</p>
          <h2 className="cms-shell__title">Content Management</h2>
          <p className="cms-shell__subtitle">Edit the public portfolio, export backups, and keep everything in sync.</p>
        </div>
        <div className="cms-shell__header-actions">
          <button type="button" className="cms-header-button" onClick={onTogglePreview}>
            {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          <button type="button" className="cms-header-button" onClick={handleExport}>
            <Download size={16} />
            Export
          </button>
          <button type="button" className="cms-header-button" onClick={() => fileInputRef.current?.click()}>
            <Upload size={16} />
            Import
          </button>
          <button type="button" className="cms-header-button" onClick={onLogout}>
            <LogOut size={16} />
            Logout
          </button>
          <button type="button" className="cms-close" onClick={onClose} aria-label="Close admin panel">
            <X size={18} />
          </button>
        </div>
        <input ref={fileInputRef} type="file" accept="application/json" className="cms-hidden-input" onChange={handleImport} />
      </div>

      <div className="cms-status cms-status--sticky">{statusMessage}</div>

      <div className={`cms-layout ${showPreview ? 'with-preview' : ''}`}>
        <aside className="cms-sidebar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`cms-tab${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}

          <div className="cms-utility-stack">
            <button type="button" className="btn btn-outline cms-utility-button" onClick={onResetToDefaults}>
              <RotateCcw size={16} />
              Reset defaults
            </button>
            <div className="cms-utility-note">
              Changes are saved to the server and reflected immediately on the public site.
            </div>
          </div>
        </aside>

        <div className="cms-content">
          {activeTab === 'overview' ? (
            <div className="cms-grid">
              <SectionCard title="Site identity" subtitle="Public branding and top-level labels.">
                <div className="cms-form-grid">
                  <Field label="Brand">
                    <TextInput
                      value={content.site.brand}
                      onChange={(event) => updatePortfolio((draft) => { draft.site.brand = event.target.value; })}
                    />
                  </Field>
                  <Field label="Owner name">
                    <TextInput
                      value={content.site.ownerName}
                      onChange={(event) => updatePortfolio((draft) => { draft.site.ownerName = event.target.value; })}
                    />
                  </Field>
                  <Field label="Role line">
                    <TextInput
                      value={content.site.role}
                      onChange={(event) => updatePortfolio((draft) => { draft.site.role = event.target.value; })}
                    />
                  </Field>
                </div>
              </SectionCard>

              <SectionCard title="Hero stats" subtitle="Update the numeric callouts on the homepage.">
                <div className="cms-array-editor">
                  {(content.hero.stats || []).filter(item => !item.deleted).map((item, index) => (
                    <div key={item.id || index} className="cms-array-item">
                      <div className="cms-array-fields cms-array-fields--split">
                        <Field label="Value">
                          <TextInput
                            value={item.value}
                            onChange={(event) => updateArrayItem(['hero', 'stats'], content.hero.stats.indexOf(item), { ...item, value: event.target.value })}
                          />
                        </Field>
                        <Field label="Label">
                          <TextInput
                            value={item.label}
                            onChange={(event) => updateArrayItem(['hero', 'stats'], content.hero.stats.indexOf(item), { ...item, label: event.target.value })}
                          />
                        </Field>
                      </div>
                      <button type="button" className="cms-icon-button" onClick={() => setItemDeletedStatus(['hero', 'stats'], item.id, true)} aria-label="Remove stat">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button type="button" className="btn btn-outline cms-add-button" onClick={() => addArrayItem(['hero', 'stats'], () => ({ id: makeId('stat'), value: '1+', label: 'New stat', deleted: false }))}>
                    <Plus size={16} />
                    Add stat
                  </button>
                </div>
              </SectionCard>

              <SectionCard title="Hero highlights" subtitle="These appear inside the hero panel list.">
                <div className="cms-array-editor">
                  {(content.hero.highlights || [])
                    .filter(item => typeof item === 'string' ? true : !item.deleted)
                    .map((item, index) => {
                      const itemId = typeof item === 'string' ? `hl-${index}` : item.id;
                      const itemText = typeof item === 'string' ? item : item.text;
                      const realIndex = content.hero.highlights.indexOf(item);
                      return (
                        <div key={itemId} className="cms-array-item">
                          <Field label={`Highlight ${index + 1}`}>
                            <TextInput
                              value={itemText}
                              onChange={(event) => updatePortfolio((draft) => {
                                const target = draft.hero.highlights[realIndex];
                                if (typeof target === 'string') {
                                  draft.hero.highlights[realIndex] = event.target.value;
                                } else {
                                  target.text = event.target.value;
                                }
                              })}
                            />
                          </Field>
                          <button
                            type="button"
                            className="cms-icon-button"
                            onClick={() => {
                              if (typeof item === 'string') {
                                setHighlightDeletedStatus(realIndex, true);
                              } else {
                                setItemDeletedStatus(['hero', 'highlights'], item.id, true);
                              }
                            }}
                            aria-label="Remove highlight"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      );
                    })}
                  <button
                    type="button"
                    className="btn btn-outline cms-add-button"
                    onClick={() => updatePortfolio((draft) => {
                      draft.hero.highlights.push({ id: makeId('highlight'), text: 'New highlight', deleted: false });
                    })}
                  >
                    <Plus size={16} />
                    Add highlight
                  </button>
                </div>
              </SectionCard>
            </div>
          ) : null}

          {activeTab === 'hero' ? (
            <div className="cms-grid">
              <SectionCard title="Hero content" subtitle="Headline, supporting copy, and imagery.">
                <div className="cms-form-grid">
                  <Field label="Eyebrow">
                    <TextInput value={content.hero.eyebrow} onChange={(event) => updatePortfolio((draft) => { draft.hero.eyebrow = event.target.value; })} />
                  </Field>
                  <Field label="Name">
                    <TextInput value={content.hero.name} onChange={(event) => updatePortfolio((draft) => { draft.hero.name = event.target.value; })} />
                  </Field>
                  <Field label="Title">
                    <TextInput value={content.hero.title} onChange={(event) => updatePortfolio((draft) => { draft.hero.title = event.target.value; })} />
                  </Field>
                  <Field label="Subtitle">
                    <TextArea rows={4} value={content.hero.subtitle} onChange={(event) => updatePortfolio((draft) => { draft.hero.subtitle = event.target.value; })} />
                  </Field>
                  <Field label="Hero image URL">
                    <TextInput value={content.hero.image} onChange={(event) => updatePortfolio((draft) => { draft.hero.image = event.target.value; })} />
                  </Field>
                  <Field label="Resume URL">
                    <TextInput value={content.hero.resumeUrl} onChange={(event) => updatePortfolio((draft) => { draft.hero.resumeUrl = event.target.value; })} />
                  </Field>
                  <Field label="Primary button label">
                    <TextInput value={content.hero.buttons.primaryLabel} onChange={(event) => updatePortfolio((draft) => { draft.hero.buttons.primaryLabel = event.target.value; })} />
                  </Field>
                  <Field label="Secondary button label">
                    <TextInput value={content.hero.buttons.secondaryLabel} onChange={(event) => updatePortfolio((draft) => { draft.hero.buttons.secondaryLabel = event.target.value; })} />
                  </Field>
                </div>
              </SectionCard>
            </div>
          ) : null}

          {activeTab === 'about' ? (
            <div className="cms-grid">
              <SectionCard title="About profile" subtitle="The profile card and supporting copy.">
                <div className="cms-form-grid">
                  <Field label="Profile name">
                    <TextInput value={content.about.profileName} onChange={(event) => updatePortfolio((draft) => { draft.about.profileName = event.target.value; })} />
                  </Field>
                  <Field label="Profile title">
                    <TextInput value={content.about.profileTitle} onChange={(event) => updatePortfolio((draft) => { draft.about.profileTitle = event.target.value; })} />
                  </Field>
                  <Field label="Bio">
                    <TextArea rows={4} value={content.about.bio} onChange={(event) => updatePortfolio((draft) => { draft.about.bio = event.target.value; })} />
                  </Field>
                  <Field label="Location">
                    <TextInput value={content.about.location} onChange={(event) => updatePortfolio((draft) => { draft.about.location = event.target.value; })} />
                  </Field>
                  <Field label="Availability">
                    <TextInput value={content.about.availability} onChange={(event) => updatePortfolio((draft) => { draft.about.availability = event.target.value; })} />
                  </Field>
                  <Field label="Technical focus">
                    <TextArea rows={4} value={content.about.technicalFocus} onChange={(event) => updatePortfolio((draft) => { draft.about.technicalFocus = event.target.value; })} />
                  </Field>
                  <Field label="Map URL">
                    <TextInput value={content.about.mapUrl} onChange={(event) => updatePortfolio((draft) => { draft.about.mapUrl = event.target.value; })} />
                  </Field>
                </div>
              </SectionCard>

              <SectionCard title="Skill bars" subtitle="Each skill renders as a progress bar.">
                <div className="cms-array-editor">
                  {(content.about.skillBars || []).filter(item => !item.deleted).map((item, index) => (
                    <div key={item.id || index} className="cms-array-item">
                      <div className="cms-array-fields cms-array-fields--split">
                        <Field label="Label">
                          <TextInput value={item.label} onChange={(event) => updateArrayItem(['about', 'skillBars'], content.about.skillBars.indexOf(item), { ...item, label: event.target.value })} />
                        </Field>
                        <Field label="Value">
                          <TextInput type="number" min="0" max="100" value={item.value} onChange={(event) => updateArrayItem(['about', 'skillBars'], content.about.skillBars.indexOf(item), { ...item, value: Number(event.target.value) })} />
                        </Field>
                        <Field label="Color">
                          <Select value={item.color} onChange={(event) => updateArrayItem(['about', 'skillBars'], content.about.skillBars.indexOf(item), { ...item, color: event.target.value })}>
                            {SKILL_COLOR_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </Select>
                        </Field>
                      </div>
                      <button type="button" className="cms-icon-button" onClick={() => setItemDeletedStatus(['about', 'skillBars'], item.id, true)} aria-label="Remove skill">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button type="button" className="btn btn-outline cms-add-button" onClick={() => addArrayItem(['about', 'skillBars'], createBlankSkill)}>
                    <Plus size={16} />
                    Add skill
                  </button>
                </div>
              </SectionCard>

              <SectionCard title="Education" subtitle="Edit schools, degrees, and status labels.">
                <div className="cms-array-editor">
                  {(content.about.education || []).filter(item => !item.deleted).map((item, index) => (
                    <div key={item.id || index} className="cms-array-item">
                      <div className="cms-array-fields cms-array-fields--stacked">
                        <Field label="Title">
                          <TextInput value={item.title} onChange={(event) => updateArrayItem(['about', 'education'], content.about.education.indexOf(item), { ...item, title: event.target.value })} />
                        </Field>
                        <Field label="Place">
                          <TextInput value={item.place} onChange={(event) => updateArrayItem(['about', 'education'], content.about.education.indexOf(item), { ...item, place: event.target.value })} />
                        </Field>
                        <Field label="Status">
                          <TextInput value={item.status} onChange={(event) => updateArrayItem(['about', 'education'], content.about.education.indexOf(item), { ...item, status: event.target.value })} />
                        </Field>
                      </div>
                      <button type="button" className="cms-icon-button" onClick={() => setItemDeletedStatus(['about', 'education'], item.id, true)} aria-label="Remove education item">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button type="button" className="btn btn-outline cms-add-button" onClick={() => addArrayItem(['about', 'education'], createBlankEducation)}>
                    <Plus size={16} />
                    Add education
                  </button>
                </div>
              </SectionCard>

              <SectionCard title="Certifications" subtitle="List items shown in the certifications card.">
                <div className="cms-array-editor">
                  {(content.about.certifications || []).filter(item => !item.deleted).map((item, index) => (
                    <div key={item.id || index} className="cms-array-item">
                      <Field label={`Certification ${index + 1}`}>
                        <TextInput value={item.label} onChange={(event) => updateArrayItem(['about', 'certifications'], content.about.certifications.indexOf(item), { ...item, label: event.target.value })} />
                      </Field>
                      <button type="button" className="cms-icon-button" onClick={() => setItemDeletedStatus(['about', 'certifications'], item.id, true)} aria-label="Remove certification">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button type="button" className="btn btn-outline cms-add-button" onClick={() => addArrayItem(['about', 'certifications'], createBlankCertification)}>
                    <Plus size={16} />
                    Add certification
                  </button>
                </div>
              </SectionCard>
            </div>
          ) : null}

          {activeTab === 'projects' ? (
            <div className="cms-grid">
              <SectionCard title="Projects" subtitle="Every featured project can be created, edited, or deleted.">
                <div className="cms-array-editor">
                  {(content.projects || []).filter(item => !item.deleted).map((item, index) => (
                    <div key={item.id || index} className="cms-array-item">
                      <div className="cms-array-fields cms-array-fields--stacked">
                        <div className="cms-form-grid">
                          <Field label="Title">
                            <TextInput value={item.title} onChange={(event) => updateArrayItem(['projects'], content.projects.indexOf(item), { ...item, title: event.target.value })} />
                          </Field>
                          <Field label="Accent">
                            <Select value={item.accent} onChange={(event) => updateArrayItem(['projects'], content.projects.indexOf(item), { ...item, accent: event.target.value })}>
                              {PROJECT_ACCENT_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                              ))}
                            </Select>
                          </Field>
                          <Field label="Icon">
                            <Select value={item.iconKey} onChange={(event) => updateArrayItem(['projects'], content.projects.indexOf(item), { ...item, iconKey: event.target.value })}>
                              {projectIcons.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                              ))}
                            </Select>
                          </Field>
                          <Field label="Link">
                            <TextInput value={item.link} onChange={(event) => updateArrayItem(['projects'], content.projects.indexOf(item), { ...item, link: event.target.value })} />
                          </Field>
                          <Field label="Image URL">
                            <TextInput value={item.image || ''} onChange={(event) => updateArrayItem(['projects'], content.projects.indexOf(item), { ...item, image: event.target.value })} />
                          </Field>
                        </div>
                        <Field label="Description">
                          <TextArea rows={4} value={item.description} onChange={(event) => updateArrayItem(['projects'], content.projects.indexOf(item), { ...item, description: event.target.value })} />
                        </Field>
                        <Field label="Tags" hint="Separate tags with commas.">
                          <TextInput
                            value={item.tags.join(', ')}
                            onChange={(event) => updateArrayItem(['projects'], content.projects.indexOf(item), {
                              ...item,
                              tags: event.target.value.split(',').map((tag) => tag.trim()).filter(Boolean),
                            })}
                          />
                        </Field>
                      </div>
                      <button type="button" className="cms-icon-button" onClick={() => setItemDeletedStatus(['projects'], item.id, true)} aria-label="Remove project">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button type="button" className="btn btn-outline cms-add-button" onClick={() => addArrayItem(['projects'], createBlankProject)}>
                    <Plus size={16} />
                    Add project
                  </button>
                </div>
              </SectionCard>
            </div>
          ) : null}

          {activeTab === 'contact' ? (
            <div className="cms-grid">
              <SectionCard title="Contact copy" subtitle="Public copy shown above the contact form.">
                <div className="cms-form-grid">
                  <Field label="Eyebrow">
                    <TextInput value={content.contact.eyebrow} onChange={(event) => updatePortfolio((draft) => { draft.contact.eyebrow = event.target.value; })} />
                  </Field>
                  <Field label="Title">
                    <TextInput value={content.contact.title} onChange={(event) => updatePortfolio((draft) => { draft.contact.title = event.target.value; })} />
                  </Field>
                  <Field label="Subtitle">
                    <TextArea rows={4} value={content.contact.subtitle} onChange={(event) => updatePortfolio((draft) => { draft.contact.subtitle = event.target.value; })} />
                  </Field>
                </div>
              </SectionCard>

              <SectionCard title="Contact cards" subtitle="Edit the public contact cards and links.">
                <div className="cms-array-editor">
                  {(content.contact.links || []).filter(item => !item.deleted).map((item, index) => (
                    <div key={item.id || index} className="cms-array-item">
                      <div className="cms-array-fields cms-array-fields--stacked">
                        <div className="cms-form-grid">
                          <Field label="Icon">
                            <Select value={item.iconKey} onChange={(event) => updateArrayItem(['contact', 'links'], content.contact.links.indexOf(item), { ...item, iconKey: event.target.value })}>
                              {CONTACT_ICON_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                              ))}
                            </Select>
                          </Field>
                          <Field label="Title">
                            <TextInput value={item.title} onChange={(event) => updateArrayItem(['contact', 'links'], content.contact.links.indexOf(item), { ...item, title: event.target.value })} />
                          </Field>
                          <Field label="Text">
                            <TextInput value={item.text} onChange={(event) => updateArrayItem(['contact', 'links'], content.contact.links.indexOf(item), { ...item, text: event.target.value })} />
                          </Field>
                          <Field label="Href">
                            <TextInput value={item.href} onChange={(event) => updateArrayItem(['contact', 'links'], content.contact.links.indexOf(item), { ...item, href: event.target.value })} />
                          </Field>
                        </div>
                      </div>
                      <button type="button" className="cms-icon-button" onClick={() => setItemDeletedStatus(['contact', 'links'], item.id, true)} aria-label="Remove contact link">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button type="button" className="btn btn-outline cms-add-button" onClick={() => addArrayItem(['contact', 'links'], createBlankContactLink)}>
                    <Plus size={16} />
                    Add contact link
                  </button>
                </div>
              </SectionCard>
            </div>
          ) : null}

          {activeTab === 'footer' ? (
            <div className="cms-grid">
              <SectionCard title="Footer brand" subtitle="Update the footer identity and quick links.">
                <div className="cms-form-grid">
                  <Field label="Brand">
                    <TextInput value={content.footer.brand} onChange={(event) => updatePortfolio((draft) => { draft.footer.brand = event.target.value; })} />
                  </Field>
                  <Field label="Name">
                    <TextInput value={content.footer.name} onChange={(event) => updatePortfolio((draft) => { draft.footer.name = event.target.value; })} />
                  </Field>
                  <Field label="Tagline">
                    <TextInput value={content.footer.tagline} onChange={(event) => updatePortfolio((draft) => { draft.footer.tagline = event.target.value; })} />
                  </Field>
                </div>
              </SectionCard>

              <SectionCard title="Footer links" subtitle="Public quick links in the site footer.">
                <div className="cms-array-editor">
                  {(content.footer.quickLinks || []).filter(item => !item.deleted).map((item, index) => (
                    <div key={item.id || index} className="cms-array-item">
                      <div className="cms-array-fields cms-array-fields--split">
                        <Field label="Label">
                          <TextInput value={item.label} onChange={(event) => updateArrayItem(['footer', 'quickLinks'], content.footer.quickLinks.indexOf(item), { ...item, label: event.target.value })} />
                        </Field>
                        <Field label="Href">
                          <TextInput value={item.href} onChange={(event) => updateArrayItem(['footer', 'quickLinks'], content.footer.quickLinks.indexOf(item), { ...item, href: event.target.value })} />
                        </Field>
                      </div>
                      <button type="button" className="cms-icon-button" onClick={() => setItemDeletedStatus(['footer', 'quickLinks'], item.id, true)} aria-label="Remove quick link">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button type="button" className="btn btn-outline cms-add-button" onClick={() => addArrayItem(['footer', 'quickLinks'], createBlankFooterLink)}>
                    <Plus size={16} />
                    Add quick link
                  </button>
                </div>
              </SectionCard>

              <SectionCard title="Footer social links" subtitle="Edit the public social profiles.">
                <div className="cms-array-editor">
                  {(content.footer.socialLinks || []).filter(item => !item.deleted).map((item, index) => (
                    <div key={item.id || index} className="cms-array-item">
                      <div className="cms-array-fields cms-array-fields--split">
                        <Field label="Icon">
                          <Select value={item.iconKey} onChange={(event) => updateArrayItem(['footer', 'socialLinks'], content.footer.socialLinks.indexOf(item), { ...item, iconKey: event.target.value })}>
                            {CONTACT_ICON_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </Select>
                        </Field>
                        <Field label="Label">
                          <TextInput value={item.label} onChange={(event) => updateArrayItem(['footer', 'socialLinks'], content.footer.socialLinks.indexOf(item), { ...item, label: event.target.value })} />
                        </Field>
                        <Field label="Href">
                          <TextInput value={item.href} onChange={(event) => updateArrayItem(['footer', 'socialLinks'], content.footer.socialLinks.indexOf(item), { ...item, href: event.target.value })} />
                        </Field>
                      </div>
                      <button type="button" className="cms-icon-button" onClick={() => setItemDeletedStatus(['footer', 'socialLinks'], item.id, true)} aria-label="Remove social link">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button type="button" className="btn btn-outline cms-add-button" onClick={() => addArrayItem(['footer', 'socialLinks'], createBlankSocialLink)}>
                    <Plus size={16} />
                    Add social link
                  </button>
                </div>
              </SectionCard>
            </div>
          ) : null}

          {activeTab === 'trash' ? (
            <div className="cms-grid">
              <SectionCard title="Trash Bin (Soft-Deleted Items)" subtitle="Recover items that were accidentally deleted, or discard them permanently.">
                <div className="cms-array-editor">
                  {!hasDeletedItems() ? (
                    <div style={{ textAlign: 'center', padding: '3rem 2rem', color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
                      Your Trash Bin is empty. Active items can be soft-deleted in their respective tabs and recovered here.
                    </div>
                  ) : (
                    <>
                      {/* Render soft-deleted Projects */}
                      {renderTrashSection('Projects', ['projects'], (item) => item.title)}

                      {/* Render soft-deleted Skill bars */}
                      {renderTrashSection('Skill Bars', ['about', 'skillBars'], (item) => item.label)}

                      {/* Render soft-deleted Education items */}
                      {renderTrashSection('Education', ['about', 'education'], (item) => item.title)}

                      {/* Render soft-deleted Certifications */}
                      {renderTrashSection('Certifications', ['about', 'certifications'], (item) => item.label)}

                      {/* Render soft-deleted Stats */}
                      {renderTrashSection('Hero Stats', ['hero', 'stats'], (item) => `${item.value} - ${item.label}`)}

                      {/* Render soft-deleted Highlights */}
                      {renderTrashHighlights()}

                      {/* Render soft-deleted Contact Links */}
                      {renderTrashSection('Contact Links', ['contact', 'links'], (item) => item.title)}

                      {/* Render soft-deleted Footer Quick Links */}
                      {renderTrashSection('Footer Quick Links', ['footer', 'quickLinks'], (item) => item.label)}

                      {/* Render soft-deleted Footer Social Links */}
                      {renderTrashSection('Footer Social Links', ['footer', 'socialLinks'], (item) => item.label)}
                    </>
                  )}
                </div>
              </SectionCard>
            </div>
          ) : null}
        </div>
        {showPreview && (
          <div className="cms-preview-pane">
            <div className="cms-preview-header">
              <span className="cms-preview-header__title">Live Preview</span>
              <div className="cms-preview-controls">
                <button
                  type="button"
                  className={`cms-preview-control-btn ${previewDevice === 'landscape' ? 'active' : ''}`}
                  onClick={() => onPreviewDeviceChange('landscape')}
                  title="Desktop View"
                >
                  <Monitor size={16} />
                </button>
                <button
                  type="button"
                  className={`cms-preview-control-btn ${previewDevice === 'portrait' ? 'active' : ''}`}
                  onClick={() => onPreviewDeviceChange('portrait')}
                  title="Mobile View"
                >
                  <Phone size={16} />
                </button>
                <button
                  type="button"
                  className="cms-preview-control-btn"
                  onClick={() => {
                    if (iframeRef.current) {
                      iframeRef.current.src = iframeRef.current.src;
                    }
                  }}
                  title="Refresh Preview"
                >
                  <RotateCw size={16} />
                </button>
              </div>
            </div>
            <div className="cms-preview-body">
              <div className="cms-preview-viewport-wrapper" ref={viewportWrapperRef}>
                <div
                  className={`cms-preview-viewport ${previewDevice}`}
                  style={previewDevice === 'portrait' ? { transform: `scale(${portraitScale})` } : {}}
                >
                  <iframe
                    ref={iframeRef}
                    src="/"
                    className="cms-preview-iframe"
                    onLoad={onIframeLoad}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (fullScreen) {
    return <div className="fullscreen-cms-container">{shellContent}</div>;
  }

  return (
    <div className="cms-overlay" role="dialog" aria-modal="true" aria-label="Content management dashboard">
      <button type="button" className="cms-backdrop" aria-label="Close admin panel" onClick={onClose} />
      {shellContent}
    </div>
  );
}
