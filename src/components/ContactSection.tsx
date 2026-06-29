'use client';

import { useEffect, useRef, useState } from 'react';
import { getSettings, initLocalStorage } from '@/services/db';
import type { SiteSettings } from '@/services/db.types';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Globe } from 'lucide-react';
import { Linkedin, Instagram } from './SocialIcons';

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export default function ContactSection() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const { ref, inView } = useInView();

  useEffect(() => {
    initLocalStorage();
    getSettings().then(setSettings);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    await new Promise(r => setTimeout(r, 1200));
    setStatus('sent');
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setStatus('idle'), 5000);
  };

  const contactItems = settings ? [
    { icon: Mail, label: 'Email', value: settings.contactEmail, href: `mailto:${settings.contactEmail}` },
    { icon: Phone, label: 'Phone', value: settings.contactPhone, href: `tel:${settings.contactPhone}` },
    { icon: MapPin, label: 'Location', value: settings.contactLocation, href: null },
  ] : [];

  const socials = settings ? [
    { icon: Globe, href: settings.socialBehance, label: 'Behance' },
    { icon: Instagram, href: settings.socialInstagram, label: 'Instagram' },
    { icon: Linkedin, href: settings.socialLinkedin, label: 'LinkedIn' },
  ] : [];

  return (
    <section id="contact" className="py-28 px-4 sm:px-6 relative"
      style={{ background: 'var(--card-bg)', borderTop: '1px solid var(--card-border)' }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 60% at 50% 0%, var(--emerald-glow), transparent)' }} />

      <div ref={ref} className="max-w-6xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ background: 'var(--emerald-glow)', color: 'var(--primary)', border: '1px solid rgba(16,185,129,0.25)', fontFamily: 'var(--font-poppins)' }}>
            Get In Touch
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4"
            style={{ fontFamily: 'var(--font-poppins)', color: 'var(--foreground)', letterSpacing: '-0.02em' }}>
            Let&apos;s Build Something{' '}
            <span style={{ background: 'linear-gradient(135deg,var(--primary),#34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Great
            </span>
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Open for freelance projects, brand collaborations, and creative partnerships. Let&apos;s talk.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Left info panel */}
          <div className={`lg:col-span-2 flex flex-col gap-6 transition-all duration-700 delay-100 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            {contactItems.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="glass-panel rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:scale-[1.02]"
                style={{ cursor: href ? 'pointer' : 'default' }}
                onClick={() => href && window.open(href, '_blank')}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--emerald-glow)' }}>
                  <Icon className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-0.5"
                    style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-poppins)' }}>{label}</p>
                  <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{value}</p>
                </div>
              </div>
            ))}

            {/* Social links */}
            <div className="glass-panel rounded-2xl p-5">
              <p className="text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-poppins)' }}>Follow My Work</p>
              <div className="flex gap-3">
                {socials.map(({ icon: Icon, href, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    aria-label={label}
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                    style={{ background: 'var(--emerald-glow)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <Icon className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right form */}
          <div className={`lg:col-span-3 glass-panel rounded-2xl p-8 transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            {status === 'sent' ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 gap-4">
                <CheckCircle className="w-14 h-14" style={{ color: 'var(--primary)' }} />
                <h3 className="text-xl font-bold" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--foreground)' }}>Message Sent!</h3>
                <p style={{ color: 'var(--text-muted)' }}>Thank you for reaching out. I&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { id: 'contact-name', label: 'Name', key: 'name', type: 'text', placeholder: 'Your name' },
                    { id: 'contact-email', label: 'Email', key: 'email', type: 'email', placeholder: 'your@email.com' },
                  ].map(({ id, label, key, type, placeholder }) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest"
                        style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-poppins)' }} htmlFor={id}>{label}</label>
                      <input id={id} type={type} required placeholder={placeholder}
                        value={form[key as keyof typeof form]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
                        style={{ background: 'var(--background)', border: '1px solid var(--card-border)', color: 'var(--foreground)' }} />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest"
                    style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-poppins)' }} htmlFor="contact-subject">Subject</label>
                  <input id="contact-subject" type="text" required placeholder="Project inquiry, collaboration…"
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
                    style={{ background: 'var(--background)', border: '1px solid var(--card-border)', color: 'var(--foreground)' }} />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest"
                    style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-poppins)' }} htmlFor="contact-message">Message</label>
                  <textarea id="contact-message" required rows={5} placeholder="Tell me about your project…"
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200 resize-none"
                    style={{ background: 'var(--background)', border: '1px solid var(--card-border)', color: 'var(--foreground)' }} />
                </div>

                {status === 'error' && (
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#f87171' }}>
                    <AlertCircle className="w-4 h-4" /> Something went wrong. Please try again.
                  </div>
                )}

                <button type="submit" id="contact-submit-btn" disabled={status === 'sending'}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.02] disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg,var(--primary),var(--accent))', color: '#fff', fontFamily: 'var(--font-poppins)', boxShadow: '0 0 20px rgba(16,185,129,0.25)' }}>
                  {status === 'sending' ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending…
                    </span>
                  ) : (
                    <><Send className="w-4 h-4" /> Send Message</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
