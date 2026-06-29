'use client';

import { useEffect, useRef, useState } from 'react';
import { getExperience, initLocalStorage } from '@/services/db';
import type { Experience } from '@/services/db.types';
import { Briefcase, ChevronRight } from 'lucide-react';

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

export default function ExperienceSection() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [active, setActive] = useState(0);
  const { ref, inView } = useInView();

  useEffect(() => {
    initLocalStorage();
    getExperience().then(setExperiences);
  }, []);

  const exp = experiences[active];

  return (
    <section id="experience" className="py-28 px-4 sm:px-6 relative">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 80% 50%, var(--emerald-glow), transparent)' }} />

      <div ref={ref} className="max-w-6xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ background: 'var(--emerald-glow)', color: 'var(--primary)', border: '1px solid rgba(16,185,129,0.25)', fontFamily: 'var(--font-poppins)' }}>
            Experience
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4"
            style={{ fontFamily: 'var(--font-poppins)', color: 'var(--foreground)', letterSpacing: '-0.02em' }}>
            My Professional{' '}
            <span style={{ background: 'linear-gradient(135deg,var(--primary),#34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Journey
            </span>
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            From freelancing to founding an agency — a track record of creative leadership and impact.
          </p>
        </div>

        {experiences.length > 0 && (
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left — tab list */}
            <div className={`lg:col-span-2 flex flex-col gap-2 transition-all duration-700 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              {experiences.map((e, i) => (
                <button
                  key={e.id}
                  onClick={() => setActive(i)}
                  className="flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-200 group"
                  style={{
                    background: active === i ? 'var(--emerald-glow)' : 'var(--card-bg)',
                    border: `1px solid ${active === i ? 'rgba(16,185,129,0.4)' : 'var(--card-border)'}`,
                  }}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: active === i ? 'rgba(16,185,129,0.2)' : 'var(--card-border)' }}>
                    <Briefcase className="w-4 h-4" style={{ color: active === i ? 'var(--primary)' : 'var(--text-muted)' }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate"
                      style={{ fontFamily: 'var(--font-poppins)', color: active === i ? 'var(--primary)' : 'var(--foreground)' }}>
                      {e.role}
                    </p>
                    <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{e.company} · {e.duration}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 ml-auto flex-shrink-0 transition-transform duration-200"
                    style={{ color: active === i ? 'var(--primary)' : 'var(--card-border)', transform: active === i ? 'rotate(0deg)' : 'rotate(-90deg)' }} />
                </button>
              ))}
            </div>

            {/* Right — detail panel */}
            {exp && (
              <div
                key={active}
                className={`lg:col-span-3 glass-panel rounded-2xl p-8 transition-all duration-500 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
              >
                <div className="mb-6">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-3"
                    style={{ background: 'rgba(16,185,129,0.12)', color: 'var(--primary)', fontFamily: 'var(--font-poppins)' }}>
                    {exp.duration}
                  </div>
                  <h3 className="text-2xl font-bold mb-1"
                    style={{ fontFamily: 'var(--font-poppins)', color: 'var(--foreground)' }}>
                    {exp.role}
                  </h3>
                  <p className="text-sm font-medium" style={{ color: 'var(--primary)' }}>{exp.company}</p>
                </div>

                <ul className="space-y-4">
                  {exp.description.map((point, i) => (
                    <li key={i} className="flex gap-3 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: 'var(--primary)' }} />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
