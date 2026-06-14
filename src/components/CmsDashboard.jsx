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
  };
}

function createBlankSkill() {
  return { id: makeId('skill'), label: 'New Skill', value: 50, color: 'cyan' };
}

function createBlankEducation() {
  return { id: makeId('education'), title: 'New Education Item', place: 'Institution', status: '' };
}

function createBlankCertification() {
  return { id: makeId('cert'), label: 'New Certification' };
}

function createBlankContactLink() {
  return {
    id: makeId('contact'),
    iconKey: 'mail',
    title: 'Link Title',
    text: 'Link text',
    href: 'https://example.com',
  };
}

function createBlankFooterLink() {
  return { id: makeId('footer'), label: 'Link Label', href: '#home' };
}

function createBlankSocialLink() {
  return { id: makeId('social'), iconKey: 'github', label: 'Social Link', href: 'https://example.com' };
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
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [authForm, setAuthForm] = useState({ email: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [statusMessage, setStatusMessage] = useState('Changes save automatically to local storage.');
  const [busy, setBusy] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (event, index, item) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      alert('Cloudinary config is missing in environment variables. Make sure VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET are set.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      setStatusMessage('Uploading project image to Cloudinary...');
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      updateArrayItem(['projects'], index, { ...item, image: data.secure_url });
      setStatusMessage('Image uploaded and updated successfully.');
    } catch (err) {
      console.error(err);
      alert('Image upload failed: ' + err.message);
      setStatusMessage('Image upload failed.');
    }
  };

  const tabs = useMemo(
    () => [
      { id: 'overview', label: 'Overview' },
      { id: 'hero', label: 'Hero' },
      { id: 'about', label: 'About' },
      { id: 'projects', label: 'Projects' },
      { id: 'contact', label: 'Contact' },
      { id: 'footer', label: 'Footer' },
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
      setStatusMessage('Dashboard unlocked. Edit any field and the public site updates immediately.');
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

  const removeArrayItem = (path, index) => {
    updatePortfolio((draft) => {
      const target = path.reduce((accumulator, key) => accumulator[key], draft);
      target.splice(index, 1);
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
      await onAuthenticate(authForm);
      setAuthForm({ email: '', password: '' });
      setStatusMessage('Signed in successfully.');
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
                Sign in to edit the live portfolio.
              </p>
            </div>
            <button type="button" className="cms-close" onClick={onClose} aria-label="Close admin panel">
              <X size={18} />
            </button>
          </div>

          <form className="cms-login-form" onSubmit={handleAuthSubmit}>
            <Field label="Email">
              <TextInput
                type="email"
                value={authForm.email}
                onChange={(event) => setAuthForm((current) => ({ ...current, email: event.target.value }))}
                autoComplete="email"
                required
              />
            </Field>
            <Field label="Password">
              <TextInput
                type="password"
                value={authForm.password}
                onChange={(event) => setAuthForm((current) => ({ ...current, password: event.target.value }))}
                autoComplete="current-password"
                required
              />
            </Field>

            {authError ? <div className="cms-status cms-status--error">{authError}</div> : null}
            <div className="cms-status">
              Enter your credentials to unlock the dashboard.
            </div>

            <div className="cms-actions-row">
              <button type="submit" className="btn btn-primary" disabled={busy}>
                <Shield size={16} />
                {busy ? 'Working...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="cms-overlay" role="dialog" aria-modal="true" aria-label="Content management dashboard">
      <button type="button" className="cms-backdrop" aria-label="Close admin panel" onClick={onClose} />
      <div className="cms-shell glass-strong">
        <div className="cms-shell__header">
          <div>
            <p className="cms-shell__eyebrow">Private access</p>
            <h2 className="cms-shell__title">Content Management</h2>
            <p className="cms-shell__subtitle">Edit the public portfolio, export backups, and keep everything in sync.</p>
          </div>
          <div className="cms-shell__header-actions">
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

        <div className="cms-layout">
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
                Changes are persisted in local storage and reflected immediately on the public site.
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
                    {content.hero.stats.map((item, index) => (
                      <div key={item.id || index} className="cms-array-item">
                        <div className="cms-array-fields cms-array-fields--split">
                          <Field label="Value">
                            <TextInput
                              value={item.value}
                              onChange={(event) => updateArrayItem(['hero', 'stats'], index, { ...item, value: event.target.value })}
                            />
                          </Field>
                          <Field label="Label">
                            <TextInput
                              value={item.label}
                              onChange={(event) => updateArrayItem(['hero', 'stats'], index, { ...item, label: event.target.value })}
                            />
                          </Field>
                        </div>
                        <button type="button" className="cms-icon-button" onClick={() => removeArrayItem(['hero', 'stats'], index)} aria-label="Remove stat">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button type="button" className="btn btn-outline cms-add-button" onClick={() => addArrayItem(['hero', 'stats'], () => ({ id: makeId('stat'), value: '1+', label: 'New stat' }))}>
                      <Plus size={16} />
                      Add stat
                    </button>
                  </div>
                </SectionCard>

                <SectionCard title="Hero highlights" subtitle="These appear inside the hero panel list.">
                  <div className="cms-array-editor">
                    {content.hero.highlights.map((item, index) => (
                      <div key={`${index}-${item}`} className="cms-array-item">
                        <Field label={`Highlight ${index + 1}`}>
                          <TextInput
                            value={item}
                            onChange={(event) => updatePortfolio((draft) => { draft.hero.highlights[index] = event.target.value; })}
                          />
                        </Field>
                        <button type="button" className="cms-icon-button" onClick={() => removeArrayItem(['hero', 'highlights'], index)} aria-label="Remove highlight">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button type="button" className="btn btn-outline cms-add-button" onClick={() => updatePortfolio((draft) => { draft.hero.highlights.push('New highlight'); })}>
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
                    {content.about.skillBars.map((item, index) => (
                      <div key={item.id || index} className="cms-array-item">
                        <div className="cms-array-fields cms-array-fields--split">
                          <Field label="Label">
                            <TextInput value={item.label} onChange={(event) => updateArrayItem(['about', 'skillBars'], index, { ...item, label: event.target.value })} />
                          </Field>
                          <Field label="Value">
                            <TextInput type="number" min="0" max="100" value={item.value} onChange={(event) => updateArrayItem(['about', 'skillBars'], index, { ...item, value: Number(event.target.value) })} />
                          </Field>
                          <Field label="Color">
                            <Select value={item.color} onChange={(event) => updateArrayItem(['about', 'skillBars'], index, { ...item, color: event.target.value })}>
                              {SKILL_COLOR_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                              ))}
                            </Select>
                          </Field>
                        </div>
                        <button type="button" className="cms-icon-button" onClick={() => removeArrayItem(['about', 'skillBars'], index)} aria-label="Remove skill">
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
                    {content.about.education.map((item, index) => (
                      <div key={item.id || index} className="cms-array-item">
                        <div className="cms-array-fields cms-array-fields--stacked">
                          <Field label="Title">
                            <TextInput value={item.title} onChange={(event) => updateArrayItem(['about', 'education'], index, { ...item, title: event.target.value })} />
                          </Field>
                          <Field label="Place">
                            <TextInput value={item.place} onChange={(event) => updateArrayItem(['about', 'education'], index, { ...item, place: event.target.value })} />
                          </Field>
                          <Field label="Status">
                            <TextInput value={item.status} onChange={(event) => updateArrayItem(['about', 'education'], index, { ...item, status: event.target.value })} />
                          </Field>
                        </div>
                        <button type="button" className="cms-icon-button" onClick={() => removeArrayItem(['about', 'education'], index)} aria-label="Remove education item">
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
                    {content.about.certifications.map((item, index) => (
                      <div key={item.id || index} className="cms-array-item">
                        <Field label={`Certification ${index + 1}`}>
                          <TextInput value={item.label} onChange={(event) => updateArrayItem(['about', 'certifications'], index, { ...item, label: event.target.value })} />
                        </Field>
                        <button type="button" className="cms-icon-button" onClick={() => removeArrayItem(['about', 'certifications'], index)} aria-label="Remove certification">
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
                    {content.projects.map((item, index) => (
                      <div key={item.id || index} className="cms-array-item">
                        <div className="cms-array-fields cms-array-fields--stacked">
                          <div className="cms-form-grid">
                            <Field label="Title">
                              <TextInput value={item.title} onChange={(event) => updateArrayItem(['projects'], index, { ...item, title: event.target.value })} />
                            </Field>
                            <Field label="Accent">
                              <Select value={item.accent} onChange={(event) => updateArrayItem(['projects'], index, { ...item, accent: event.target.value })}>
                                {PROJECT_ACCENT_OPTIONS.map((option) => (
                                  <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                              </Select>
                            </Field>
                            <Field label="Icon">
                              <Select value={item.iconKey} onChange={(event) => updateArrayItem(['projects'], index, { ...item, iconKey: event.target.value })}>
                                {projectIcons.map((option) => (
                                  <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                              </Select>
                            </Field>
                            <Field label="Link">
                              <TextInput value={item.link} onChange={(event) => updateArrayItem(['projects'], index, { ...item, link: event.target.value })} />
                            </Field>
                            <div className="cms-image-upload-group" style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', width: '100%' }}>
                              <div style={{ flex: 1 }}>
                                <Field label="Image URL">
                                  <TextInput value={item.image || ''} onChange={(event) => updateArrayItem(['projects'], index, { ...item, image: event.target.value })} />
                                </Field>
                              </div>
                              <div style={{ marginBottom: '16px' }}>
                                <input
                                  type="file"
                                  accept="image/*"
                                  id={`upload-${index}`}
                                  style={{ display: 'none' }}
                                  onChange={(e) => handleImageUpload(e, index, item)}
                                />
                                <label htmlFor={`upload-${index}`} className="btn btn-outline" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', height: '42px', padding: '0 16px', borderRadius: '8px' }}>
                                  <Upload size={14} />
                                  Upload
                                </label>
                              </div>
                            </div>
                          </div>
                          <Field label="Description">
                            <TextArea rows={4} value={item.description} onChange={(event) => updateArrayItem(['projects'], index, { ...item, description: event.target.value })} />
                          </Field>
                          <Field label="Tags" hint="Separate tags with commas.">
                            <TextInput
                              value={item.tags.join(', ')}
                              onChange={(event) => updateArrayItem(['projects'], index, {
                                ...item,
                                tags: event.target.value.split(',').map((tag) => tag.trim()).filter(Boolean),
                              })}
                            />
                          </Field>
                        </div>
                        <button type="button" className="cms-icon-button" onClick={() => removeArrayItem(['projects'], index)} aria-label="Remove project">
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
                    {content.contact.links.map((item, index) => (
                      <div key={item.id || index} className="cms-array-item">
                        <div className="cms-array-fields cms-array-fields--stacked">
                          <div className="cms-form-grid">
                            <Field label="Icon">
                              <Select value={item.iconKey} onChange={(event) => updateArrayItem(['contact', 'links'], index, { ...item, iconKey: event.target.value })}>
                                {CONTACT_ICON_OPTIONS.map((option) => (
                                  <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                              </Select>
                            </Field>
                            <Field label="Title">
                              <TextInput value={item.title} onChange={(event) => updateArrayItem(['contact', 'links'], index, { ...item, title: event.target.value })} />
                            </Field>
                            <Field label="Text">
                              <TextInput value={item.text} onChange={(event) => updateArrayItem(['contact', 'links'], index, { ...item, text: event.target.value })} />
                            </Field>
                            <Field label="Href">
                              <TextInput value={item.href} onChange={(event) => updateArrayItem(['contact', 'links'], index, { ...item, href: event.target.value })} />
                            </Field>
                          </div>
                        </div>
                        <button type="button" className="cms-icon-button" onClick={() => removeArrayItem(['contact', 'links'], index)} aria-label="Remove contact link">
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
                    {content.footer.quickLinks.map((item, index) => (
                      <div key={item.id || index} className="cms-array-item">
                        <div className="cms-array-fields cms-array-fields--split">
                          <Field label="Label">
                            <TextInput value={item.label} onChange={(event) => updateArrayItem(['footer', 'quickLinks'], index, { ...item, label: event.target.value })} />
                          </Field>
                          <Field label="Href">
                            <TextInput value={item.href} onChange={(event) => updateArrayItem(['footer', 'quickLinks'], index, { ...item, href: event.target.value })} />
                          </Field>
                        </div>
                        <button type="button" className="cms-icon-button" onClick={() => removeArrayItem(['footer', 'quickLinks'], index)} aria-label="Remove quick link">
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
                    {content.footer.socialLinks.map((item, index) => (
                      <div key={item.id || index} className="cms-array-item">
                        <div className="cms-array-fields cms-array-fields--split">
                          <Field label="Icon">
                            <Select value={item.iconKey} onChange={(event) => updateArrayItem(['footer', 'socialLinks'], index, { ...item, iconKey: event.target.value })}>
                              {CONTACT_ICON_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                              ))}
                            </Select>
                          </Field>
                          <Field label="Label">
                            <TextInput value={item.label} onChange={(event) => updateArrayItem(['footer', 'socialLinks'], index, { ...item, label: event.target.value })} />
                          </Field>
                          <Field label="Href">
                            <TextInput value={item.href} onChange={(event) => updateArrayItem(['footer', 'socialLinks'], index, { ...item, href: event.target.value })} />
                          </Field>
                        </div>
                        <button type="button" className="cms-icon-button" onClick={() => removeArrayItem(['footer', 'socialLinks'], index)} aria-label="Remove social link">
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
          </div>
        </div>
      </div>
    </div>
  );
}
