'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowDown, Download, Briefcase, Sparkles } from 'lucide-react';
import Image from 'next/image';

const TITLES = [
  'Graphic Designer',
  'Brand Strategist',
  'Visual Identity Expert',
  'Creative Director',
  'Founder of TheVision X',
];

export default function HeroSection() {
  const [titleIdx, setTitleIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [stats, setStats] = useState({ projects: 0, clients: 0, years: 0 });
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Typewriter effect
  useEffect(() => {
    const target = TITLES[titleIdx];
    if (!deleting && displayed.length < target.length) {
      animRef.current = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === target.length) {
      animRef.current = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && displayed.length > 0) {
      animRef.current = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setTitleIdx((i) => (i + 1) % TITLES.length);
    }
    return () => { if (animRef.current) clearTimeout(animRef.current); };
  }, [displayed, deleting, titleIdx]);

  // Animated counter
  useEffect(() => {
    const targets = { projects: 100, clients: 50, years: 3 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const ease = 1 - Math.pow(1 - progress, 3);
      setStats({
        projects: Math.round(targets.projects * ease),
        clients: Math.round(targets.clients * ease),
        years: Math.round(targets.years * ease),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden grid-pattern radial-glow"
    >
      {/* Decorative orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--primary), transparent)' }} />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--primary), transparent)' }} />
      <div className="mt-22 mb-10 flex justify-center">
        <div className="profile-frame">
          <Image
            src="/images/profile.jpg"
            alt="Mostafa Sherif"
            width={250}
            height={250}
            className="profile-image"
  />
</div>
      </div>
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 animate-fade-in"
          style={{ background: 'var(--emerald-glow)', border: '1px solid rgba(16,185,129,0.3)' }}>
          <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--primary)' }} />
          <span className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: 'var(--primary)', fontFamily: 'var(--font-poppins)' }}>
            Available for Freelance Projects
          </span>
        </div>

        {/* Name */}
        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-4 animate-fade-in delay-100"
          style={{
            fontFamily: 'var(--font-poppins)',
            color: 'var(--foreground)',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
          }}
        >
          Mostafa Sherif
          <span
            className="block"
            style={{
              background: 'linear-gradient(135deg, var(--primary) 30%, #34d399 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Fahmy
          </span>
        </h1>

        {/* Typewriter subtitle */}
        <div
          className="h-10 flex items-center justify-center mb-6 animate-fade-in delay-200"
          style={{ minHeight: '2.5rem' }}
        >
          <p
            className="text-xl sm:text-2xl font-semibold"
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-poppins)' }}
          >
            {displayed}
            <span
              className="inline-block w-0.5 h-6 ml-0.5 align-middle animate-pulse"
              style={{ background: 'var(--primary)' }}
            />
          </p>
        </div>

        {/* Description */}
        <p
          className="text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in delay-300"
          style={{ color: 'var(--text-muted)' }}
        >
          Crafting premium visual identities, branding systems, and creative campaigns
          that elevate brands and drive results. 6+ years of transforming ideas into
          impactful, agency-level design.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in delay-400">
          <button
            onClick={() => scrollTo('portfolio')}
            id="view-portfolio-btn"
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              color: '#fff',
              fontFamily: 'var(--font-poppins)',
              boxShadow: '0 0 24px rgba(16,185,129,0.3)',
            }}
          >
            <Briefcase className="w-4 h-4" />
            View Portfolio
          </button>
          <a
            href="/Mostafa_Sherif_Fahmy_CV.pdf"
            download
            id="download-cv-btn"
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105"
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              color: 'var(--foreground)',
              fontFamily: 'var(--font-poppins)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Download className="w-4 h-4" style={{ color: 'var(--primary)' }} />
            Download CV
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto animate-fade-in delay-400">
          {[
            { value: stats.projects, suffix: '+', label: 'Projects Delivered' },
            { value: stats.clients, suffix: '+', label: 'Happy Clients' },
            { value: stats.years, suffix: '', label: 'Years Experience' },
          ].map(({ value, suffix, label }) => (
            <div key={label} className="text-center">
              <div
                className="text-3xl font-extrabold mb-0.5"
                style={{
                  fontFamily: 'var(--font-poppins)',
                  background: 'linear-gradient(135deg, var(--primary), #34d399)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {value}{suffix}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

     
    </section>
  );
}




