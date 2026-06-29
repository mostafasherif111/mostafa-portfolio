'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthContext';
import {
  Zap, LayoutDashboard, FolderOpen, Award, Briefcase,
  MessageSquare, Settings, Users, Activity, LogOut,
  ChevronRight, Shield, Eye
} from 'lucide-react';

const ROLE_BADGE: Record<string, { label: string; color: string }> = {
  super_admin: { label: 'Super Admin', color: '#10b981' },
  editor:      { label: 'Editor',      color: '#3b82f6' },
  viewer:      { label: 'Viewer',      color: '#8b5cf6' },
};

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: string[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Overview',     href: '/admin',                icon: LayoutDashboard,  roles: ['super_admin','editor','viewer'] },
  { label: 'Projects',     href: '/admin/projects',       icon: FolderOpen,       roles: ['super_admin','editor'] },
  { label: 'Skills',       href: '/admin/skills',         icon: Award,            roles: ['super_admin','editor'] },
  { label: 'Experience',   href: '/admin/experience',     icon: Briefcase,        roles: ['super_admin','editor'] },
  { label: 'Testimonials', href: '/admin/testimonials',   icon: MessageSquare,    roles: ['super_admin','editor'] },
  { label: 'Activity Logs',href: '/admin/logs',           icon: Activity,         roles: ['super_admin','editor'] },
  { label: 'Users',        href: '/admin/users',          icon: Users,            roles: ['super_admin'] },
  { label: 'Settings',     href: '/admin/settings',       icon: Settings,         roles: ['super_admin'] },
];

export default function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const { session, signOut } = useAuth();
  const pathname = usePathname();
  const badge = session ? ROLE_BADGE[session.role] : null;

  const visibleItems = NAV_ITEMS.filter(item =>
    session && item.roles.includes(session.role)
  );

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--background)', borderRight: '1px solid var(--card-border)' }}>
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: '1px solid var(--card-border)' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,var(--primary),var(--accent))' }}>
          <Zap className="w-4 h-4 text-white" />
        </div>
        <div>
          <span className="font-bold text-base leading-none" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--foreground)' }}>
            Mostafa<span style={{ color: 'var(--primary)' }}> Sherif</span>
          </span>
          <p className="text-xs leading-none mt-0.5" style={{ color: 'var(--text-muted)' }}>CMS Dashboard</p>
        </div>
      </div>

      {/* User badge */}
      {session && (
        <div className="mx-3 my-3 p-3 rounded-xl" style={{ background: 'var(--emerald-glow)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,var(--primary),var(--accent))' }}>
              {session.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--foreground)' }}>
                {session.name}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                {session.role === 'super_admin' ? <Shield className="w-3 h-3" style={{ color: badge?.color }} /> :
                 session.role === 'editor' ? <Zap className="w-3 h-3" style={{ color: badge?.color }} /> :
                 <Eye className="w-3 h-3" style={{ color: badge?.color }} />}
                <span className="text-xs font-medium" style={{ color: badge?.color, fontFamily: 'var(--font-poppins)' }}>
                  {badge?.label}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 px-3 overflow-y-auto py-2">
        {visibleItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href} onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all duration-200 group"
              style={{
                background: isActive ? 'var(--emerald-glow)' : 'transparent',
                border: `1px solid ${isActive ? 'rgba(16,185,129,0.3)' : 'transparent'}`,
              }}>
              <Icon className="w-4 h-4 flex-shrink-0"
                style={{ color: isActive ? 'var(--primary)' : 'var(--text-muted)' }} />
              <span className="text-sm font-medium flex-1"
                style={{ fontFamily: 'var(--font-poppins)', color: isActive ? 'var(--primary)' : 'var(--foreground)' }}>
                {label}
              </span>
              {isActive && <ChevronRight className="w-3.5 h-3.5" style={{ color: 'var(--primary)' }} />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-3" style={{ borderTop: '1px solid var(--card-border)' }}>
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all duration-200 hover:opacity-80"
          style={{ color: 'var(--text-muted)' }}>
          <ChevronRight className="w-4 h-4 rotate-180" />
          <span className="text-sm" style={{ fontFamily: 'var(--font-poppins)' }}>Back to Site</span>
        </Link>
        <button onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 hover:opacity-80"
          style={{ color: '#f87171' }}>
          <LogOut className="w-4 h-4" />
          <span className="text-sm" style={{ fontFamily: 'var(--font-poppins)' }}>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
