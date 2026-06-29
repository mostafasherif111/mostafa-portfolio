'use client';

import Link from 'next/link';
import { Zap, Heart, ArrowUp, Globe } from 'lucide-react';
import { Linkedin, Instagram } from './SocialIcons';

const NAV = ['About', 'Skills', 'Experience', 'Portfolio', 'Testimonials', 'Contact'];

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative pt-16 pb-8 px-4 sm:px-6"
      style={{ borderTop: '1px solid var(--card-border)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}>
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--foreground)' }}>
                Vision<span style={{ color: 'var(--primary)' }}>X</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-muted)' }}>
              Premium graphic design & brand identity studio founded by Mostafa Sherif Fahmy. Based in Cairo, serving clients worldwide.
            </p>
            <div className="flex gap-2">
              {[
                { icon: Globe, href: '#', label: 'Behance' },
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Linkedin, href: '#', label: 'LinkedIn' },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                  <Icon className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-poppins)' }}>Quick Links</p>
            <ul className="space-y-2">
              {NAV.map(name => (
                <li key={name}>
                  <button
                    onClick={() => document.getElementById(name.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-sm transition-colors duration-200 hover:opacity-100"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-poppins)' }}>Services</p>
            <ul className="space-y-2">
              {['Brand Identity Design', 'Social Media Design', 'Thumbnail Design', 'Print Design', 'Visual Identity', 'Advertising Campaigns'].map(s => (
                <li key={s} className="text-sm" style={{ color: 'var(--text-muted)' }}>{s}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px mb-6" style={{ background: 'var(--card-border)' }} />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} Vision X · Made with <Heart className="w-3 h-3 fill-current" style={{ color: 'var(--primary)' }} /> by Mostafa Sherif Fahmy
          </p>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-xs transition-colors duration-200 hover:opacity-100"
              style={{ color: 'var(--text-muted)' }}>
              Admin Dashboard
            </Link>
            <button onClick={scrollTop}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
              aria-label="Scroll to top">
              <ArrowUp className="w-4 h-4" style={{ color: 'var(--primary)' }} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
