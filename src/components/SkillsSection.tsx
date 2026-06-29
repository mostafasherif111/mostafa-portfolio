'use client';

import { useEffect, useRef, useState } from 'react';
import { getSkills } from '@/services/db';
import { initLocalStorage } from '@/services/db';
import type { Skill } from '@/services/db.types';
import { Image, Shield, Share2, Tv, Printer, Award, Code2, Cpu, Video, Sparkles } from 'lucide-react';

function getSkillIcon(skill: Skill): React.ElementType {
  const name = (skill.name || '').toLowerCase();
  if (name.includes('photoshop')) return Image;
  if (name.includes('illustrator') || name.includes('vector')) return Cpu;
  if (name.includes('after effects') || name.includes('premiere') || name.includes('video') || name.includes('motion')) return Video;
  if (name.includes('branding') || name.includes('identity')) return Shield;
  if (name.includes('social') || name.includes('marketing') || name.includes('campaign') || name.includes('share')) return Share2;
  if (name.includes('thumbnail') || name.includes('tv') || name.includes('youtube')) return Tv;
  if (name.includes('print') || name.includes('printer') || name.includes('editorial') || name.includes('book')) return Printer;
  if (name.includes('award') || name.includes('lead') || name.includes('medal')) return Award;
  if (name.includes('code') || name.includes('html') || name.includes('css') || name.includes('web') || name.includes('javascript') || name.includes('react')) return Code2;
  if (name.includes('ai') || name.includes('midjourney') || name.includes('stable diffusion') || name.includes('generation')) return Sparkles;

  if (skill.category === 'design') return Image;
  if (skill.category === 'technical') return Code2;
  if (skill.category === 'marketing') return Share2;
  return Award;
}

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

function SkillBar({ skill, animate }: { skill: Skill; animate: boolean }) {
  const Icon = getSkillIcon(skill);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (animate) {
      const t = setTimeout(() => setWidth(skill.proficiency), 200);
      return () => clearTimeout(t);
    }
  }, [animate, skill.proficiency]);

  return (
    <div className="glass-panel rounded-xl p-4 transition-all duration-300 hover:scale-[1.02]"
      style={{ '--hover-glow': '0 4px 24px rgba(16,185,129,0.12)' } as React.CSSProperties}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 24px rgba(16,185,129,0.12)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = '')}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--emerald-glow)' }}>
            <Icon className="w-4 h-4" style={{ color: 'var(--primary)' }} />
          </div>
          <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--foreground)' }}>
            {skill.name}
          </span>
        </div>
        <span className="text-xs font-bold tabular-nums" style={{ color: 'var(--primary)', fontFamily: 'var(--font-poppins)' }}>
          {skill.proficiency}%
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--card-border)' }}>
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${width}%`,
            background: 'linear-gradient(90deg, var(--primary), #34d399)',
          }}
        />
      </div>
    </div>
  );
}

const CATEGORY_LABELS: Record<string, string> = {
  design: 'Design & Creative Tools',
  technical: 'Technical & AI Skills',
  marketing: 'Marketing',
  other: 'Other',
};

export default function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const { ref, inView } = useInView();

  useEffect(() => {
    initLocalStorage();
    getSkills().then(setSkills);
  }, []);

  // group by category
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <section id="skills" className="py-28 px-4 sm:px-6 relative" style={{ background: 'var(--card-bg)', borderTop: '1px solid var(--card-border)', borderBottom: '1px solid var(--card-border)' }}>
      <div ref={ref} className="max-w-6xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ background: 'var(--emerald-glow)', color: 'var(--primary)', border: '1px solid rgba(16,185,129,0.25)', fontFamily: 'var(--font-poppins)' }}>
            Skills & Tools
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4"
            style={{ fontFamily: 'var(--font-poppins)', color: 'var(--foreground)', letterSpacing: '-0.02em' }}>
            My Creative{' '}
            <span style={{ background: 'linear-gradient(135deg,var(--primary),#34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Arsenal
            </span>
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            A versatile toolkit spanning Adobe creative software, branding strategy, and modern AI-driven workflows.
          </p>
        </div>

        {/* Skills grouped */}
        {Object.entries(grouped).map(([cat, catSkills], gi) => (
          <div
            key={cat}
            className={`mb-10 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: `${gi * 100}ms` }}
          >
            <h3 className="text-sm font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'var(--primary)', fontFamily: 'var(--font-poppins)' }}>
              {CATEGORY_LABELS[cat] || cat}
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {catSkills.map((skill, i) => (
                <div key={skill.id} style={{ transitionDelay: `${i * 60}ms` }}>
                  <SkillBar skill={skill} animate={inView} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
