'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, useCallback } from 'react';
import { getProjects, initLocalStorage } from '@/services/db';
import type { Project } from '@/services/db.types';
import { Search, X, ExternalLink, Tag, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

const CATEGORIES = ['All', 'Branding', 'Social Media Design', 'Posters', 'Thumbnails', 'Print Design', 'Advertising Campaigns'];

function useInView(threshold = 0.05) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function ProtectedImage({ src, alt, className, style }: { src: string; alt: string; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={style}
      onContextMenu={e => e.preventDefault()}
      onDragStart={e => e.preventDefault()}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover pointer-events-none select-none"
        draggable={false}
        unoptimized
      />
      <div className="absolute inset-0" style={{ background: 'transparent', zIndex: 1 }} />
    </div>
  );
}

function getProjectPreview(project: Project, index = 0) {
  const images = project.images?.length ? project.images : project.imageUrl ? [project.imageUrl] : [];
  return images[index] || images[0] || '/images/profile.jpg';
}

function ProjectCard({ project, onOpen, index, visible }: {
  project: Project; onOpen: (p: Project, index?: number) => void; index: number; visible: boolean;
}) {
  const imageCount = project.images?.length || (project.imageUrl ? 1 : 0);

  return (
    <div
      className="glass-panel rounded-2xl overflow-hidden group cursor-pointer transition-all duration-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transitionDelay: `${index * 60}ms`,
      }}
      onClick={() => onOpen(project, 0)}
    >
      <div className="relative overflow-hidden h-52">
        <ProtectedImage
          src={getProjectPreview(project)}
          alt={project.title}
          className="w-full h-full"
        />
        {/* hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
          style={{ background: 'rgba(0,0,0,0.6)', zIndex: 2 }}>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
            style={{ background: 'var(--primary)', color: '#fff', fontFamily: 'var(--font-poppins)' }}>
            <ZoomIn className="w-4 h-4" />
            View Project
          </div>
        </div>
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-semibold z-10"
          style={{ background: 'rgba(16,185,129,0.85)', color: '#fff', fontFamily: 'var(--font-poppins)', backdropFilter: 'blur(6px)' }}>
          {project.category}
        </span>
        {imageCount > 1 && (
          <span className="absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-semibold z-10"
            style={{ background: 'rgba(0,0,0,0.55)', color: '#fff', fontFamily: 'var(--font-poppins)' }}>
            {imageCount} images
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-base mb-1.5 line-clamp-1"
          style={{ fontFamily: 'var(--font-poppins)', color: 'var(--foreground)' }}>
          {project.title}
        </h3>
        <p className="text-xs leading-relaxed line-clamp-2 mb-3" style={{ color: 'var(--text-muted)' }}>
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map(tag => (
            <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs"
              style={{ background: 'var(--emerald-glow)', color: 'var(--primary)' }}>
              <Tag className="w-2.5 h-2.5" />
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Lightbox({ project, index, onClose, onSelect }: { project: Project; index: number; onClose: () => void; onSelect: (newIndex: number) => void; }) {
  const gallery = project.images?.length ? project.images : project.imageUrl ? [project.imageUrl] : ['/images/profile.jpg'];
  const selectedIndex = Math.max(0, Math.min(index, gallery.length - 1));
  const selectedImage = gallery[selectedIndex];
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && gallery.length > 1) onSelect((selectedIndex + 1) % gallery.length);
      if (e.key === 'ArrowLeft' && gallery.length > 1) onSelect((selectedIndex - 1 + gallery.length) % gallery.length);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [gallery.length, onClose, onSelect, selectedIndex]);

  const onTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const touchEndX = event.changedTouches[0]?.clientX ?? null;
    if (touchEndX === null) return;

    const diff = touchStartX.current - touchEndX;
    const threshold = 40;
    if (Math.abs(diff) < threshold) return;

    if (diff > 0) {
      onSelect((selectedIndex + 1) % gallery.length);
    } else {
      onSelect((selectedIndex - 1 + gallery.length) % gallery.length);
    }
    touchStartX.current = null;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      <div className="relative max-w-4xl w-full max-h-[90vh] overflow-auto rounded-2xl"
        style={{ background: 'var(--background)', border: '1px solid var(--card-border)' }}
        onClick={e => e.stopPropagation()}>
        <button onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <X className="w-4 h-4" style={{ color: 'var(--foreground)' }} />
        </button>
        <div className="relative h-72 sm:h-[420px] overflow-hidden rounded-t-2xl"
          onContextMenu={e => e.preventDefault()}
          onDragStart={e => e.preventDefault()}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <Image
            src={selectedImage}
            alt={project.title}
            fill
            className="object-cover pointer-events-none select-none"
            draggable={false}
            unoptimized
          />
          {gallery.length > 1 && (
            <>
              <div className="absolute inset-x-0 top-4 flex items-center justify-center px-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(0,0,0,0.45)', color: '#fff', fontFamily: 'var(--font-poppins)' }}>
                  {selectedIndex + 1} / {gallery.length}
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-4 flex items-center justify-between px-4">
                <button
                  type="button"
                  onClick={() => onSelect((selectedIndex - 1 + gallery.length) % gallery.length)}
                  className="w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center transition hover:bg-black/60"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => onSelect((selectedIndex + 1) % gallery.length)}
                  className="w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center transition hover:bg-black/60"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
        </div>
        <div className="p-7">
          <span className="inline-block px-3 py-1 rounded-lg text-xs font-semibold mb-3"
            style={{ background: 'var(--emerald-glow)', color: 'var(--primary)', fontFamily: 'var(--font-poppins)' }}>
            {project.category}
          </span>
          <h2 className="text-2xl font-bold mb-3"
            style={{ fontFamily: 'var(--font-poppins)', color: 'var(--foreground)' }}>
            {project.title}
          </h2>
          <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-muted)' }}>{project.description}</p>
          <div className="flex flex-wrap gap-2 mb-5">
            {project.tags.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-lg text-xs"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--text-muted)' }}>
                {tag}
              </span>
            ))}
          </div>
          {gallery.length > 1 && (
            <div className="mb-5 grid grid-cols-4 gap-2">
              {gallery.map((image, idx) => (
                <button key={image + idx} type="button" onClick={() => onSelect(idx)}
                  className={`relative h-20 rounded-xl overflow-hidden border transition ${idx === selectedIndex ? 'border-primary' : 'border-transparent'}`}>
                  <Image src={image} alt={`${project.title} preview ${idx + 1}`} fill className="object-cover" unoptimized />
                </button>
              ))}
            </div>
          )}
          {project.link && (
            <a href={project.link} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105"
              style={{ background: 'linear-gradient(135deg,var(--primary),var(--accent))', color: '#fff', fontFamily: 'var(--font-poppins)' }}>
              <ExternalLink className="w-4 h-4" />
              View on Behance
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PortfolioSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [lightbox, setLightbox] = useState<Project | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const { ref, inView } = useInView();

  useEffect(() => {
    initLocalStorage();
    getProjects().then(setProjects);
  }, []);

  const filtered = projects.filter(p => {
    const matchCat = category === 'All' || p.category === category;
    const matchSearch = search === '' ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const openLightbox = useCallback((p: Project, index = 0) => {
    setLightbox(p);
    setLightboxIndex(index);
  }, []);

  return (
    <section id="portfolio" className="py-28 px-4 sm:px-6 relative"
      style={{ background: 'var(--card-bg)', borderTop: '1px solid var(--card-border)', borderBottom: '1px solid var(--card-border)' }}>
      <div ref={ref} className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ background: 'var(--emerald-glow)', color: 'var(--primary)', border: '1px solid rgba(16,185,129,0.25)', fontFamily: 'var(--font-poppins)' }}>
            Portfolio
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4"
            style={{ fontFamily: 'var(--font-poppins)', color: 'var(--foreground)', letterSpacing: '-0.02em' }}>
            Selected{' '}
            <span style={{ background: 'linear-gradient(135deg,var(--primary),#34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Works
            </span>
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Explore a curated collection of branding, social media, posters, and creative campaigns.
          </p>
        </div>

        {/* Search bar */}
        <div className={`flex flex-col sm:flex-row gap-4 mb-8 transition-all duration-700 delay-100 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search projects, tags…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2"
              style={{
                background: 'var(--background)',
                border: '1px solid var(--card-border)',
                color: 'var(--foreground)',
                fontFamily: 'var(--font-inter)',
                '--tw-ring-color': 'var(--primary)',
              } as React.CSSProperties}
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
              </button>
            )}
          </div>
        </div>

        {/* Category filters */}
        <div className={`flex flex-wrap gap-2 mb-10 transition-all duration-700 delay-150 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-105"
              style={{
                fontFamily: 'var(--font-poppins)',
                background: category === cat ? 'linear-gradient(135deg,var(--primary),var(--accent))' : 'var(--card-bg)',
                border: `1px solid ${category === cat ? 'transparent' : 'var(--card-border)'}`,
                color: category === cat ? '#fff' : 'var(--text-muted)',
              }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Project grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <ProjectCard key={p.id} project={p} onOpen={openLightbox} index={i} visible={inView} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>
            <p className="text-lg font-medium" style={{ fontFamily: 'var(--font-poppins)' }}>No projects found</p>
            <p className="text-sm mt-1">Try a different category or search term.</p>
          </div>
        )}
      </div>

      {lightbox && <Lightbox project={lightbox} index={lightboxIndex} onClose={() => setLightbox(null)} onSelect={setLightboxIndex} />}
    </section>
  );
}
