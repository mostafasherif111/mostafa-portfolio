'use client';

import { MOCK_USERS } from '@/services/mockData';
import { Shield, Zap, Eye, User } from 'lucide-react';

export default function UsersPanel() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--foreground)' }}>
          Users & Permissions
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          View registered administrators and editors with system privileges.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_USERS.map((user) => {
          const isSuper = user.role === 'super_admin';
          const isEditor = user.role === 'editor';

          return (
            <div key={user.email} className="glass-panel rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--emerald-glow)' }}>
                    <User className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: isSuper ? 'rgba(16,185,129,0.1)' : isEditor ? 'rgba(59,130,246,0.1)' : 'rgba(139,92,246,0.1)',
                      color: isSuper ? '#10b981' : isEditor ? '#3b82f6' : '#8b5cf6',
                      border: `1px solid ${isSuper ? 'rgba(16,185,129,0.2)' : isEditor ? 'rgba(59,130,246,0.2)' : 'rgba(139,92,246,0.2)'}`
                    }}>
                    {isSuper ? <Shield className="w-3.5 h-3.5" /> : isEditor ? <Zap className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    {isSuper ? 'Super Admin' : isEditor ? 'Editor' : 'Viewer'}
                  </span>
                </div>
                <h3 className="font-bold text-base" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--foreground)' }}>
                  {user.name}
                </h3>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                  {user.email}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--card-border)' }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-poppins)' }}>
                  Granted Scope
                </p>
                <ul className="space-y-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                  {isSuper && (
                    <>
                      <li className="flex items-center gap-1.5">✓ Full Read/Write access</li>
                      <li className="flex items-center gap-1.5">✓ System settings modification</li>
                      <li className="flex items-center gap-1.5">✓ User logs audit inspection</li>
                    </>
                  )}
                  {isEditor && (
                    <>
                      <li className="flex items-center gap-1.5">✓ Edit portfolio projects/skills</li>
                      <li className="flex items-center gap-1.5">✓ Edit experience/testimonials</li>
                      <li className="flex items-center gap-1.5">✗ Cannot edit settings</li>
                    </>
                  )}
                  {!isSuper && !isEditor && (
                    <>
                      <li className="flex items-center gap-1.5">✓ View-only access</li>
                      <li className="flex items-center gap-1.5">✗ Cannot save changes</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
