'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getProjects, addProject, updateProject, deleteProject, initLocalStorage } from '@/services/db';
import type { Project } from '@/services/db.types';
import { ensureSupabaseClient, STORAGE_BUCKET, isSupabaseConfigured, isSupabaseStorageConfigured } from '@/lib/supabase';
import { Plus, Pencil, Trash2, X, Save, Tag, ChevronLeft, ChevronRight } from 'lucide-react';

type ProjectForm = Omit<Project, 'id' | 'created_at'>;
const CATEGORIES = ['Branding','Social Media Design','Posters','Thumbnails','Print Design','Advertising Campaigns'];
const EMPTY: ProjectForm = { title:'', description:'', category: CATEGORIES[0], images: [], tags:[], link:'', imageUrl: '' };

export default function ProjectsPanel() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [modal, setModal] = useState<'add'|'edit'|null>(null);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState<string|null>(null);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<string|null>(null);
  const storageEnabled = isSupabaseConfigured() && isSupabaseStorageConfigured();

  const load = async () => { initLocalStorage(); setProjects(await getProjects()); };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setTagInput(''); setEditId(null); setError(''); setModal('add'); };
  const openEdit = (p: Project) => {
    setForm({
      title: p.title,
      description: p.description,
      category: p.category,
      images: p.images?.length ? p.images : p.imageUrl ? [p.imageUrl] : [],
      tags: [...p.tags],
      link: p.link||'',
      imageUrl: p.imageUrl || p.images?.[0] || '',
    });
    setTagInput(''); setEditId(p.id); setError(''); setModal('edit');
  };

  const moveImage = (from: number, to: number) => {
    setForm(f => {
      const next = [...f.images];
      const [item] = next.splice(from, 1);
      if (!item) return f;
      const clampedTo = Math.max(0, Math.min(to, next.length));
      next.splice(clampedTo, 0, item);
      return { ...f, images: next, imageUrl: next[0] || f.imageUrl || '' };
    });
  };

  const removeImage = (index: number) => {
    setForm(f => {
      const next = f.images.filter((_, i) => i !== index);
      return { ...f, images: next, imageUrl: next[0] || f.imageUrl || '' };
    });
  };

  const uploadProjectFiles = async (files: File[]) => {
    if (!files.length) return;
    if (!storageEnabled) throw new Error('Supabase storage is not configured. Image uploads are disabled.');
    setUploadingImage(true);

    try {
      const supabase = ensureSupabaseClient();
      const uploadedUrls: string[] = [];
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB

      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          throw new Error(`Invalid file type: ${file.name} (${file.type}). Only images allowed.`);
        }

        if (file.size > MAX_SIZE) {
          throw new Error(`File too large: ${file.name} (${Math.round(file.size / 1024)} KB). Max 5MB.`);
        }

        if (!STORAGE_BUCKET) {
          throw new Error('Supabase storage bucket is not configured. Set NEXT_PUBLIC_STORAGE_BUCKET.');
        }

        const fileName = `projects/${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
        const { data, error } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(fileName, file);

        if (error || !data) {
          throw new Error(error?.message ?? 'Image upload failed');
        }

        const publicUrlResult = await supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(data.path);

        let publicUrl = publicUrlResult.data?.publicUrl;

        if (!publicUrl || typeof publicUrl !== 'string' || !publicUrl.trim()) {
          try {
            const signed = await supabase.storage.from(STORAGE_BUCKET).createSignedUrl(data.path, 60 * 60);
            publicUrl = signed.data?.signedUrl ?? '';
          } catch {
            publicUrl = '';
          }
        }

        if (!publicUrl || typeof publicUrl !== 'string' || !publicUrl.trim()) {
          throw new Error(`Failed to obtain a usable URL for ${file.name}`);
        }

        uploadedUrls.push(publicUrl);
      }

      setForm(f => ({
        ...f,
        images: [...f.images, ...uploadedUrls],
        imageUrl: f.imageUrl || uploadedUrls[0] || '',
      }));
    } catch (uploadError) {
      setError((uploadError as Error).message || 'Unable to upload image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUploadInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!storageEnabled) return;
    if (!e.target.files?.length) return;
    uploadProjectFiles(Array.from(e.target.files));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!storageEnabled || !e.dataTransfer.files.length) return;
    uploadProjectFiles(Array.from(e.dataTransfer.files));
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) { setForm(f => ({ ...f, tags: [...f.tags, t] })); }
    setTagInput('');
  };

  const save = async () => {
    setSaving(true);
    setError('');

    try {
      const payload: Omit<Project, 'id' | 'created_at'> = {
        ...form,
        images: form.images.length ? form.images : form.imageUrl ? [form.imageUrl] : [],
        imageUrl: form.imageUrl || form.images[0] || '',
      };

      if (modal === 'add') {
        await addProject(payload);
      } else if (modal === 'edit' && editId) {
        await updateProject(editId, payload);
      }

      await load();
      setModal(null);
    } catch (err) {
      setError((err as Error).message || 'Unable to save project.');
    } finally {
      setSaving(false);
    }
  };
  const remove = async (id: string) => { await deleteProject(id); await load(); setDeleteId(null); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily:'var(--font-poppins)', color:'var(--foreground)' }}>Projects</h1>
          <p className="text-sm mt-1" style={{ color:'var(--text-muted)' }}>Manage your portfolio projects.</p>
        </div>
        <button onClick={openAdd} id="add-project-btn"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105"
          style={{ background:'linear-gradient(135deg,var(--primary),var(--accent))', color:'#fff', fontFamily:'var(--font-poppins)' }}>
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {/* Project list */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {projects.map(p => (
          <div key={p.id} className="glass-panel rounded-2xl overflow-hidden group">
            <div className="h-40 relative overflow-hidden">
                <Image
                  src={p.images?.[0] || p.imageUrl || '/images/profile.jpg'}
                  alt={p.title}
                  fill
                  className="object-cover pointer-events-none"
                  draggable={false}
                  unoptimized
                />
                <div className="absolute inset-0 flex items-end justify-end p-3 gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200"
                  style={{ background:'rgba(0,0,0,0.55)' }}>
                <button onClick={() => openEdit(p)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  style={{ background:'var(--primary)' }}>
                  <Pencil className="w-3.5 h-3.5 text-white" />
                </button>
                <button onClick={() => setDeleteId(p.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  style={{ background:'#ef4444' }}>
                  <Trash2 className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-xs font-semibold"
                style={{ background:'rgba(16,185,129,0.85)', color:'#fff', fontFamily:'var(--font-poppins)' }}>{p.category}</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-sm truncate" style={{ fontFamily:'var(--font-poppins)', color:'var(--foreground)' }}>{p.title}</h3>
              <p className="text-xs mt-1 line-clamp-2" style={{ color:'var(--text-muted)' }}>{p.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {p.tags.slice(0,2).map(t=>(
                  <span key={t} className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs"
                    style={{ background:'var(--emerald-glow)', color:'var(--primary)' }}>
                    <Tag className="w-2.5 h-2.5"/>{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:'rgba(0,0,0,0.8)', backdropFilter:'blur(8px)' }}>
          <div className="w-full max-w-lg rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto" style={{ background:'var(--background)', border:'1px solid var(--card-border)' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom:'1px solid var(--card-border)' }}>
              <h2 className="font-bold" style={{ fontFamily:'var(--font-poppins)', color:'var(--foreground)' }}>
                {modal === 'add' ? 'Add New Project' : 'Edit Project'}
              </h2>
              <button onClick={() => setModal(null)}><X className="w-5 h-5" style={{ color:'var(--text-muted)' }}/></button>
            </div>
            <div className="p-6 space-y-4">
              {error && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              {[
                { label:'Title', key:'title', type:'text', placeholder:'Project title' },
                { label:'Image URL', key:'imageUrl', type:'url', placeholder:'https://...' },
                { label:'Project Link', key:'link', type:'url', placeholder:'https://behance.net/...' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
                    style={{ color:'var(--text-muted)', fontFamily:'var(--font-poppins)' }}>{label}</label>
                  <input type={type} placeholder={placeholder} value={form[key as keyof typeof form] as string}
                    onChange={e => {
                      const value = e.target.value;
                      setForm(f => ({
                        ...f,
                        [key]: value,
                        ...(key === 'imageUrl' ? { imageUrl: value, images: value ? (f.images.length ? f.images : [value]) : f.images } : {}),
                      }));
                    }}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background:'var(--card-bg)', border:'1px solid var(--card-border)', color:'var(--foreground)' }}/>
                </div>
              ))}
              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
                  style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-poppins)' }}
                >
                  Upload Images
                </label>

                <div
                  className="relative rounded-2xl border border-dashed border-slate-600/40 bg-slate-950/10 p-4 text-center transition hover:border-slate-500"
                  onDragOver={e => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={!storageEnabled}
                    onChange={handleUploadInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="relative z-10 pointer-events-none">
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      Drag & drop images here, or click to browse.
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                      Upload multiple images to create a project gallery.
                    </p>
                  </div>

                  {!storageEnabled && (
                    <div className="mt-3 rounded-2xl border border-yellow-400/20 bg-yellow-500/10 p-3 text-sm text-yellow-200">
                      Supabase storage is not configured. Image uploads are disabled until <code>NEXT_PUBLIC_SUPABASE_URL</code>, <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, and <code>NEXT_PUBLIC_STORAGE_BUCKET</code> are set.
                    </div>
                  )}
                </div>

                {uploadingImage && (
                  <p className="text-sm mt-2">Uploading images...</p>
                )}

                {form.images.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-poppins)' }}>
                        Project Images
                      </span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        Drag/drop to reorder
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {form.images.map((src, idx) => (
                        <div key={`${src}-${idx}`} className="relative rounded-3xl overflow-hidden border border-card-border">
                          <div className="relative h-28">
                            <Image
                              src={src}
                              alt={`Project image ${idx + 1}`}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 p-2 bg-black/50">
                            <span className="text-[11px] text-white">{idx + 1}</span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => moveImage(idx, idx - 1)}
                                disabled={idx === 0}
                                className="w-8 h-8 rounded-full bg-white/10 text-white disabled:opacity-40"
                                aria-label="Move left"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveImage(idx, idx + 1)}
                                disabled={idx === form.images.length - 1}
                                className="w-8 h-8 rounded-full bg-white/10 text-white disabled:opacity-40"
                                aria-label="Move right"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="w-8 h-8 rounded-full bg-red-500/90 text-white"
                                aria-label="Remove image"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
                  style={{ color:'var(--text-muted)', fontFamily:'var(--font-poppins)' }}>Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background:'var(--card-bg)', border:'1px solid var(--card-border)', color:'var(--foreground)' }}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
                  style={{ color:'var(--text-muted)', fontFamily:'var(--font-poppins)' }}>Description</label>
                <textarea rows={3} placeholder="Project description…" value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                  style={{ background:'var(--card-bg)', border:'1px solid var(--card-border)', color:'var(--foreground)' }}/>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
                  style={{ color:'var(--text-muted)', fontFamily:'var(--font-poppins)' }}>Tags</label>
                <div className="flex gap-2 mb-2">
                  <input placeholder="Add tag…" value={tagInput} onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-3 py-2 rounded-xl text-sm outline-none"
                    style={{ background:'var(--card-bg)', border:'1px solid var(--card-border)', color:'var(--foreground)' }}/>
                  <button onClick={addTag} className="px-3 py-2 rounded-xl text-sm font-semibold"
                    style={{ background:'var(--emerald-glow)', color:'var(--primary)' }}>Add</button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {form.tags.map(t => (
                    <span key={t} className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs"
                      style={{ background:'var(--emerald-glow)', color:'var(--primary)' }}>
                      {t}<button onClick={() => setForm(f=>({...f, tags: f.tags.filter(x=>x!==t)}))}>
                        <X className="w-3 h-3"/></button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background:'var(--card-bg)', border:'1px solid var(--card-border)', color:'var(--foreground)', fontFamily:'var(--font-poppins)' }}>
                  Cancel
                </button>
                <button onClick={save} disabled={saving} id="save-project-btn"
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-60"
                  style={{ background:'linear-gradient(135deg,var(--primary),var(--accent))', color:'#fff', fontFamily:'var(--font-poppins)' }}>
                  {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <><Save className="w-4 h-4"/>Save</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:'rgba(0,0,0,0.8)', backdropFilter:'blur(8px)' }}>
          <div className="glass-panel rounded-2xl p-7 max-w-sm w-full text-center">
            <Trash2 className="w-10 h-10 mx-auto mb-3" style={{ color:'#ef4444' }}/>
            <h3 className="font-bold mb-2" style={{ fontFamily:'var(--font-poppins)', color:'var(--foreground)' }}>Delete Project?</h3>
            <p className="text-sm mb-6" style={{ color:'var(--text-muted)' }}>This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background:'var(--card-bg)', border:'1px solid var(--card-border)', color:'var(--foreground)' }}>Cancel</button>
              <button onClick={() => remove(deleteId)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background:'#ef4444', color:'#fff' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
