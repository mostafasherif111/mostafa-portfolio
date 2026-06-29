'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { getTestimonials, initLocalStorage } from '@/services/db';
import type { Testimonial } from '@/services/db.types';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';

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

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [current, setCurrent] = useState(0);
  const { ref, inView } = useInView();

  useEffect(() => {
    initLocalStorage();
    getTestimonials().then(setTestimonials);
  }, []);

  const prev = () => setCurrent(i => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent(i => (i + 1) % testimonials.length);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testimonials.length]);

  const t = testimonials[current];

  return (
    <section id="testimonials" className="py-28 px-4 sm:px-6 relative">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 20% 50%, var(--emerald-glow), transparent)' }} />

      <div ref={ref} className="max-w-5xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ background: 'var(--emerald-glow)', color: 'var(--primary)', border: '1px solid rgba(16,185,129,0.25)', fontFamily: 'var(--font-poppins)' }}>
            Testimonials
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4"
            style={{ fontFamily: 'var(--font-poppins)', color: 'var(--foreground)', letterSpacing: '-0.02em' }}>
            What Clients{' '}
            <span style={{ background: 'linear-gradient(135deg,var(--primary),#34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Say
            </span>
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Real feedback from clients and collaborators across industries.
          </p>
        </div>

        {t && (
          <div className={`transition-all duration-700 delay-100 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Main card */}
            <div key={current} className="glass-panel rounded-3xl p-8 sm:p-12 relative overflow-hidden"
              style={{ boxShadow: '0 8px 64px rgba(16,185,129,0.08)' }}>
              {/* Quote icon */}
              <div className="absolute top-8 right-8 opacity-10">
                <Quote className="w-20 h-20" style={{ color: 'var(--primary)' }} />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" style={{ color: 'var(--primary)' }} />
                ))}
              </div>

              {/* Quote text */}
              <blockquote
                className="text-lg sm:text-xl leading-relaxed mb-8 relative z-10"
                style={{ color: 'var(--foreground)', fontFamily: 'var(--font-inter)' }}>
                &ldquo;{t.content}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                {t.imageUrl ? (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-emerald-500 pointer-events-none select-none"
                    onContextMenu={e => e.preventDefault()}>
                    <Image
                      src={t.imageUrl}
                      alt={t.name}
                      fill
                      className="object-cover"
                      draggable={false}
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                    style={{ background: 'linear-gradient(135deg,var(--primary),var(--accent))', color: '#fff' }}>
                    {t.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-semibold" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--foreground)' }}>{t.name}</p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t.role} · {t.company}</p>
                </div>
              </div>
            </div>

            {/* Controls + dots */}
            <div className="flex items-center justify-center gap-6 mt-8">
              <button onClick={prev}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                <ChevronLeft className="w-4 h-4" style={{ color: 'var(--foreground)' }} />
              </button>

              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button key={i} onClick={() => setCurrent(i)}
                    className="transition-all duration-300 rounded-full"
                    style={{
                      width: i === current ? '24px' : '8px',
                      height: '8px',
                      background: i === current ? 'var(--primary)' : 'var(--card-border)',
                    }} />
                ))}
              </div>

              <button onClick={next}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                <ChevronRight className="w-4 h-4" style={{ color: 'var(--foreground)' }} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
