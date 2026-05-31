import { useState, useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { Linkedin, Mail, Phone, MapPin } from 'lucide-react';

function SectionHeading({ children, className = '' }) {
  return <h2 className={`section-heading ${className}`}>{children}</h2>;
}

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ kind: '', message: '' });
  const contactFormRef = useRef(null);

  useEffect(() => {
    emailjs.init('CtQwEFyX5Kq-7gqmJ');
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ kind: '', message: '' });

    try {
      await emailjs.sendForm('service_tbdm0d2', 'template_pch5iiw', contactFormRef.current);
      setStatus({ kind: 'success', message: "Thanks! I'll get back to you soon." });
      contactFormRef.current?.reset();
    } catch (error) {
      setStatus({ kind: 'error', message: 'Message failed to send. Please try email or LinkedIn directly.' });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section contact-template">
      <div className="contact-template-header">
        <span className="contact-template-eyebrow">Let’s talk</span>
        <SectionHeading>
          Get In <span className="text-gradient-shimmer">Touch</span>
        </SectionHeading>
        <p className="contact-template-subtitle">
          Have a project in mind or looking for a collaborator? Send a message and I’ll reply soon.
        </p>
      </div>

      <div className="contact-template-grid">
        <div className="contact-template-info reveal-left">
          <a
            href="https://www.linkedin.com/in/ameya-ramteke"
            target="_blank"
            rel="noreferrer"
            className="glass contact-card card-3d"
          >
            <div className="contact-icon-wrapper cyan">
              <Linkedin style={{ width: 24, height: 24 }} />
            </div>
            <div>
              <h3 className="contact-card-title">LinkedIn</h3>
              <p className="contact-card-text">ameya-ramteke</p>
            </div>
          </a>
          <a href="mailto:ameyaramteke07.work@gmail.com" className="glass contact-card card-3d">
            <div className="contact-icon-wrapper cyan">
              <Mail style={{ width: 24, height: 24 }} />
            </div>
            <div>
              <h3 className="contact-card-title">Email Me</h3>
              <p className="contact-card-text">ameyaramteke07.work@gmail.com</p>
            </div>
          </a>
          <a href="tel:+919422651580" className="glass contact-card card-3d">
            <div className="contact-icon-wrapper purple">
              <Phone style={{ width: 24, height: 24 }} />
            </div>
            <div>
              <h3 className="contact-card-title">Call Me</h3>
              <p className="contact-card-text">+91 9422651580</p>
            </div>
          </a>
          <div className="glass contact-card card-3d">
            <div className="contact-icon-wrapper pink">
              <MapPin style={{ width: 24, height: 24 }} />
            </div>
            <div>
              <h3 className="contact-card-title">Location</h3>
              <p className="contact-card-text">Nagpur, India (440023)</p>
            </div>
          </div>
        </div>

        <form
          ref={contactFormRef}
          onSubmit={handleSubmit}
          className="glass-strong contact-form contact-template-form reveal-right"
        >
          <h3 className="form-title">Send a Message</h3>
          <div className="form-group">
            <label className="form-label" htmlFor="from_name">Your Name</label>
            <input id="from_name" type="text" name="from_name" required className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="from_email">Your Email</label>
            <input id="from_email" type="email" name="from_email" required className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="message">Message</label>
            <textarea id="message" name="message" rows="4" required className="form-input" style={{ resize: 'vertical' }} />
          </div>

          {status.message && (
            <div className={`form-status ${status.kind}`}>
              {status.message}
            </div>
          )}

          <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-submit">
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  );
}
