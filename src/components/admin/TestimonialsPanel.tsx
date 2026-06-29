'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getTestimonials, addTestimonial, updateTestimonial, deleteTestimonial, initLocalStorage } from '@/services/db';
import type { Testimonial } from '@/services/db.types';
import { Plus, Pencil, Trash2, X, Save, Quote } from 'lucide-react';

const EMPTY: Omit<Testimonial, 'id'> = { name: '', role: '', company: '', content: '', imageUrl: '' };

export default function TestimonialsPanel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [form, setForm] = useState<Omit<Testimonial, 'id'>>(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    initLocalStorage();
    setTestimonials(await getTestimonials());
  };

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setForm(EMPTY);
    setEditId(null);
    setModal('add');
  };

  const openEdit = (t: Testimonial) => {
    setForm({
      name: t.name,
      role: t.role,
      company: t.company,
      content: t.content,
      imageUrl: t.imageUrl || '',
    });
    setEditId(t.id);
    setModal('edit');
  };

  const save = async () => {
    setSaving(true);
    try {
      if (modal === 'add') await addTestimonial(form);
      else if (modal === 'edit' && editId) await updateTestimonial(editId, form);
      await load();
      setModal(null);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    await deleteTestimonial(id);
    await load();
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--foreground)' }}>
            Testimonials
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Manage client reviews and feedback.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg,var(--primary),var(--accent))', color: '#fff', fontFamily: 'var(--font-poppins)' }}
        >
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {testimonials.map((t) => (
          <div key={t.id} className="glass-panel rounded-2xl p-6 group flex flex-col justify-between relative">
            <Quote className="absolute top-4 right-4 w-8 h-8 opacity-5 pointer-events-none" style={{ color: 'var(--primary)' }} />
            <div>
              <div className="flex items-center gap-3 mb-4">
                {t.imageUrl ? (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border" style={{ borderColor: 'var(--card-border)' }}>
                    <Image src={t.imageUrl} alt={t.name} fill className="object-cover" unoptimized />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ background: 'linear-gradient(135deg,var(--primary),var(--accent))' }}>
                    {t.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-sm" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--foreground)' }}>
                    {t.name}
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {t.role} · <strong style={{ color: 'var(--primary)' }}>{t.company}</strong>
                  </p>
                </div>
              </div>
              <p className="text-xs italic leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                &ldquo;{t.content}&rdquo;
              </p>
            </div>

            <div className="flex gap-1 justify-end mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEdit(t)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--emerald-glow)' }}>
                <Pencil className="w-3.5 h-3.5" style={{ color: 'var(--primary)' }} />
              </button>
              <button onClick={() => setDeleteId(t.id)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)' }}>
                <Trash2 className="w-3.5 h-3.5" style={{ color: '#ef4444' }} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-md rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto" style={{ background: 'var(--background)', border: '1px solid var(--card-border)' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--card-border)' }}>
              <h2 className="font-bold" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--foreground)' }}>
                {modal === 'add' ? 'Add Testimonial' : 'Edit Testimonial'}
              </h2>
              <button onClick={() => setModal(null)}><X className="w-5 h-5" style={{ color: 'var(--text-muted)' }} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-poppins)' }}>
                  Client Name
                </label>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. John Doe"
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--foreground)' }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-poppins)' }}>
                    Role / Position
                  </label>
                  <input value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} placeholder="e.g. CEO"
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--foreground)' }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-poppins)' }}>
                    Company
                  </label>
                  <input value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} placeholder="e.g. Google"
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--foreground)' }} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-poppins)' }}>
                  Profile Image URL
                </label>
                <input value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..."
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--foreground)' }} />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-poppins)' }}>
                  Feedback / Review
                </label>
                <textarea rows={4} placeholder="Review text..." value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--foreground)' }} />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--foreground)', fontFamily: 'var(--font-poppins)' }}>
                  Cancel
                </button>
                <button onClick={save} disabled={saving}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg,var(--primary),var(--accent))', color: '#fff', fontFamily: 'var(--font-poppins)' }}>
                  {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-4 h-4" />Save</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
          <div className="glass-panel rounded-2xl p-7 max-w-sm w-full text-center">
            <Trash2 className="w-10 h-10 mx-auto mb-3" style={{ color: '#ef4444' }} />
            <h3 className="font-bold mb-2" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--foreground)' }}>Delete Testimonial?</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--foreground)' }}>Cancel</button>
              <button onClick={() => remove(deleteId)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{ background: '#ef4444', color: '#fff' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
