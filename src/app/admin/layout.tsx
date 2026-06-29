'use client';

import { useState } from 'react';
import { AuthProvider, useAuth } from '@/components/admin/AuthContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import LoginForm from '@/components/admin/LoginForm';
import { Menu, X } from 'lucide-react';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
        <div className="flex flex-col items-center gap-3">
          <span className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          <span className="text-sm font-semibold tracking-wider uppercase" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-poppins)' }}>
            Loading Dashboard...
          </span>
        </div>
      </div>
    );
  }

  if (!session) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen flex relative">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:block w-64 flex-shrink-0 h-screen sticky top-0">
        <AdminSidebar />
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-background border-r md:hidden">
            <div className="h-full relative">
              <button 
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg border text-muted-foreground"
                style={{ borderColor: 'var(--card-border)', background: 'var(--card-bg)' }}
              >
                <X className="w-4 h-4" />
              </button>
              <AdminSidebar onClose={() => setMobileOpen(false)} />
            </div>
          </aside>
        </>
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col min-h-screen" style={{ background: 'var(--background)' }}>
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b" style={{ background: 'var(--background)', borderColor: 'var(--card-border)' }}>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setMobileOpen(true)}
              className="p-1.5 rounded-lg border text-muted-foreground"
              style={{ borderColor: 'var(--card-border)', background: 'var(--card-bg)' }}
            >
              <Menu className="w-4 h-4" />
            </button>
            <span className="font-bold text-base" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--foreground)' }}>
              Vision<span style={{ color: 'var(--primary)' }}>X</span>
            </span>
          </div>
          <div className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: 'var(--emerald-glow)', color: 'var(--primary)' }}>
            {session.role === 'super_admin' ? 'Admin' : session.role === 'editor' ? 'Editor' : 'Viewer'}
          </div>
        </header>

        <div className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  );
}
