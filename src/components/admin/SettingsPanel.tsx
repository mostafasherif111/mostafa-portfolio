'use client';

import { useEffect, useState } from 'react';
import { getSettings, updateSettings, initLocalStorage } from '@/services/db';
import type { SiteSettings } from '@/services/db.types';
import { Save, Mail, Globe, Shield, ToggleLeft, ToggleRight, Check } from 'lucide-react';

export default function SettingsPanel() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    initLocalStorage();
    getSettings().then(setSettings);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setSaved(false);
    try {
      await updateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <span className="w-8 h-8 border-3 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Loading Settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--foreground)' }}>
          Site Settings
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Update contact details, social media linkages, and media security features.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact info card */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-4 h-4" style={{ color: 'var(--primary)' }} />
            <h2 className="font-semibold text-sm" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--foreground)' }}>
              Contact Information
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-poppins)' }}>
                Contact Email
              </label>
              <input type="email" required value={settings.contactEmail} onChange={e => setSettings(s => s ? ({ ...s, contactEmail: e.target.value }) : null)}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: 'var(--background)', border: '1px solid var(--card-border)', color: 'var(--foreground)' }} />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-poppins)' }}>
                Contact Phone
              </label>
              <input type="text" required value={settings.contactPhone} onChange={e => setSettings(s => s ? ({ ...s, contactPhone: e.target.value }) : null)}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: 'var(--background)', border: '1px solid var(--card-border)', color: 'var(--foreground)' }} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-poppins)' }}>
              Location Office
            </label>
            <input type="text" required value={settings.contactLocation} onChange={e => setSettings(s => s ? ({ ...s, contactLocation: e.target.value }) : null)}
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: 'var(--background)', border: '1px solid var(--card-border)', color: 'var(--foreground)' }} />
          </div>
        </div>

        {/* Social Link card */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4" style={{ color: 'var(--primary)' }} />
            <h2 className="font-semibold text-sm" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--foreground)' }}>
              Social Accounts
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-poppins)' }}>
                Behance Portfolio
              </label>
              <input type="url" required value={settings.socialBehance} onChange={e => setSettings(s => s ? ({ ...s, socialBehance: e.target.value }) : null)}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: 'var(--background)', border: '1px solid var(--card-border)', color: 'var(--foreground)' }} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-poppins)' }}>
                  Instagram Profile
                </label>
                <input type="url" required value={settings.socialInstagram} onChange={e => setSettings(s => s ? ({ ...s, socialInstagram: e.target.value }) : null)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: 'var(--background)', border: '1px solid var(--card-border)', color: 'var(--foreground)' }} />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-poppins)' }}>
                  LinkedIn Profile
                </label>
                <input type="url" required value={settings.socialLinkedin} onChange={e => setSettings(s => s ? ({ ...s, socialLinkedin: e.target.value }) : null)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: 'var(--background)', border: '1px solid var(--card-border)', color: 'var(--foreground)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Security & Features card */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4" style={{ color: 'var(--primary)' }} />
            <h2 className="font-semibold text-sm" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--foreground)' }}>
              Security & Features
            </h2>
          </div>

          <div className="space-y-4">
            {/* Watermark toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: 'var(--card-border)', background: 'var(--card-bg)' }}>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Enable Watermark</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Apply overlay watermark on images</p>
              </div>
              <button type="button" onClick={() => setSettings(s => s ? ({ ...s, enableWatermark: !s.enableWatermark }) : null)}>
                {settings.enableWatermark ? <ToggleRight className="w-10 h-10 text-emerald-500" /> : <ToggleLeft className="w-10 h-10 text-slate-500" />}
              </button>
            </div>

            {settings.enableWatermark && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-poppins)' }}>
                  Watermark Label Text
                </label>
                <input type="text" value={settings.watermarkText} onChange={e => setSettings(s => s ? ({ ...s, watermarkText: e.target.value }) : null)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: 'var(--background)', border: '1px solid var(--card-border)', color: 'var(--foreground)' }} />
              </div>
            )}

            {/* Image Protection toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: 'var(--card-border)', background: 'var(--card-bg)' }}>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Right-Click Image Protection</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Disable context-menus and dragging on images to prevent theft</p>
              </div>
              <button type="button" onClick={() => setSettings(s => s ? ({ ...s, enableImageProtection: !s.enableImageProtection }) : null)}>
                {settings.enableImageProtection ? <ToggleRight className="w-10 h-10 text-emerald-500" /> : <ToggleLeft className="w-10 h-10 text-slate-500" />}
              </button>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving} id="save-settings-btn"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.02] disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg,var(--primary),var(--accent))', color: '#fff', fontFamily: 'var(--font-poppins)', boxShadow: '0 0 20px rgba(16,185,129,0.25)' }}>
            {saving ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : saved ? (
              <><Check className="w-4 h-4" /> Settings Saved</>
            ) : (
              <><Save className="w-4 h-4" /> Save Settings</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
