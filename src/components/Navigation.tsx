'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import { Sun, Moon, Menu, X, Zap } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
];

export default function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('hero');
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 40);

    const sections = NAV_LINKS.map(l => l.href.replace('#', ''));
    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i]);
      if (el && window.scrollY >= el.offsetTop - 120) {
        setActive(sections[i]);
        break;
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass-nav shadow-lg shadow-black/20' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => scrollTo('#hero')}
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}>
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight"
                style={{ fontFamily: 'var(--font-poppins)', color: 'var(--foreground)' }}>
                Mostafa<span style={{ color: 'var(--primary)' }}> Sherif</span>
              </span>
            </button>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const id = link.href.replace('#', '');
                return (
                  <button
                    key={link.href}
                    onClick={() => scrollTo(link.href)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      active === id
                        ? 'text-white'
                        : 'hover:opacity-80'
                    }`}
                    style={{
                      color: active === id ? 'var(--primary)' : 'var(--text-muted)',
                      background: active === id ? 'var(--emerald-glow)' : 'transparent',
                    }}
                  >
                    {link.label}
                  </button>
                );
              })}
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                id="theme-toggle-btn"
                className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
                aria-label="Toggle theme"
              >
                {theme === 'dark'
                  ? <Sun className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                  : <Moon className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                }
              </button>

              {/* Admin link */}
              <Link
                href="/admin"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                  color: '#fff',
                  fontFamily: 'var(--font-poppins)',
                }}
              >
                <Zap className="w-3.5 h-3.5" />
                Dashboard
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
              >
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div
        className={`fixed top-16 left-0 right-0 z-40 md:hidden transition-all duration-300 ${
          mobileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="glass-panel mx-4 rounded-xl overflow-hidden">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="w-full text-left px-5 py-3.5 text-sm font-medium border-b transition-colors duration-200 hover:opacity-80"
              style={{
                color: active === link.href.replace('#', '') ? 'var(--primary)' : 'var(--foreground)',
                borderColor: 'var(--card-border)',
              }}
            >
              {link.label}
            </button>
          ))}
          <Link
            href="/admin"
            className="flex items-center gap-2 px-5 py-3.5 text-sm font-medium"
            style={{ color: 'var(--primary)' }}
          >
            <Zap className="w-4 h-4" /> Admin Dashboard
          </Link>
        </div>
      </div>
    </>
  );
}
