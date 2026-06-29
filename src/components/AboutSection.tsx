'use client';

import { useEffect, useRef, useState } from 'react';
import { Code2, Cpu, Palette, Users, Award, Calendar } from 'lucide-react';

const highlights = [
  { icon: Palette, label: 'Graphic Design', sub: 'Since 2020' },
  { icon: Award,   label: 'Brand Identity',  sub: '50+ Brands' },
  { icon: Users,   label: 'Creative Leader', sub: 'BrainX & SCIVerse' },
  { icon: Cpu,     label: 'AI + Design',     sub: 'Modern Workflows' },
  { icon: Code2,   label: 'HTML & CSS',       sub: 'Technical Skills' },
  { icon: Calendar,label: 'The Vision X Founder',sub: '2026 – Present' },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export default function AboutSection() {
  const { ref, inView } = useInView();

  return (
    <section id="about" className="py-28 px-4 sm:px-6 relative">
      {/* subtle radial behind section */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 100%, var(--emerald-glow), transparent)' }} />

      <div ref={ref} className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ background: 'var(--emerald-glow)', color: 'var(--primary)', border: '1px solid rgba(16,185,129,0.25)', fontFamily: 'var(--font-poppins)' }}>
            About Me
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4"
            style={{ fontFamily: 'var(--font-poppins)', color: 'var(--foreground)', letterSpacing: '-0.02em' }}>
            The Story Behind the{' '}
            <span style={{ background: 'linear-gradient(135deg,var(--primary),#34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Design
            </span>
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            A passionate creative professional turning complex ideas into elegant visual realities.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left — narrative */}
          <div className={`transition-all duration-700 delay-100 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="space-y-5 text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              <p>
                My journey into Graphic Design began in <strong style={{ color: 'var(--foreground)' }}>2020</strong>, driven by a deep
                love for visual communication and storytelling through design. What started as a curiosity evolved into a
                career built on delivering <strong style={{ color: 'var(--foreground)' }}>agency-level creative work</strong> for
                educators, creators, local businesses, and organizations across the region.
              </p>
              <p>
                Over the years, I&apos;ve led media teams at <strong style={{ color: 'var(--foreground)' }}>BrainX</strong> and{' '}
                <strong style={{ color: 'var(--foreground)' }}>Cairo SCIVerse</strong>, managing design output, establishing
                visual guidelines, and executing multi-channel campaigns that generate measurable impact. In{' '}
                <strong style={{ color: 'var(--foreground)' }}>2023</strong>, I founded{' '}
                <strong style={{ color: 'var(--primary)' }}>The Vision X</strong> — a creative design agency dedicated to
                building powerful brand identities and digital experiences.
              </p>
              <p>
                Today I&apos;m also at the frontier of <strong style={{ color: 'var(--foreground)' }}>AI-assisted design workflows</strong>,
                integrating generative models, prompt engineering, and automation scripts into day-to-day production to
                deliver faster, smarter, and bolder results. I also hold an{' '}
                <strong style={{ color: 'var(--foreground)' }}>AI Delegate</strong> role at <strong style={{ color: 'var(--foreground)' }}>SBS</strong>, where I present on
                AI&apos;s role in creative industries.
              </p>
              <p>
                My mission: make every brand unforgettable.
              </p>
            </div>

            {/* CTA */}
            <div className="mt-8 flex gap-3">
              <a
                href="#portfolio"
                onClick={e => { e.preventDefault(); document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105"
                style={{ background: 'linear-gradient(135deg,var(--primary),var(--accent))', color: '#fff', fontFamily: 'var(--font-poppins)' }}
              >
                See My Work
              </a>
              <a
                href="#contact"
                onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-80"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--foreground)', fontFamily: 'var(--font-poppins)' }}
              >
                Let&apos;s Talk
              </a>
            </div>
          </div>

          {/* Right — highlight cards */}
          <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4 transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            {highlights.map(({ icon: Icon, label, sub }, i) => (
              <div
                key={label}
                className="glass-panel rounded-2xl p-5 flex flex-col gap-3 group cursor-default transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{
                  transitionDelay: `${i * 60}ms`,
                  boxShadow: '0 0 0 transparent',
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 32px rgba(16,185,129,0.15)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 0 transparent')}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--emerald-glow)' }}>
                  <Icon className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                </div>
                <div>
                  <p className="font-semibold text-sm leading-tight" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--foreground)' }}>{label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}




