'use client';

import { useEffect, useState } from 'react';
import { getLogs, initLocalStorage } from '@/services/db';
import type { ActivityLog } from '@/services/db.types';
import { Activity, Clock, User } from 'lucide-react';

export default function LogsPanel() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    initLocalStorage();
    getLogs().then(setLogs);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--foreground)' }}>
          Activity Logs
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Review the audit trail of CMS database updates.
        </p>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-xs font-semibold uppercase tracking-wider" style={{ borderColor: 'var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-muted)' }}>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm" style={{ borderColor: 'var(--card-border)' }}>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center" style={{ color: 'var(--text-muted)' }}>
                    No activity logs recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-emerald-500/[0.02] transition-colors">
                    <td className="px-6 py-4 white-space-nowrap" style={{ color: 'var(--text-muted)' }}>
                      <span className="flex items-center gap-1.5 text-xs">
                        <Clock className="w-3.5 h-3.5" style={{ color: 'var(--primary)' }} />
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 white-space-nowrap font-medium" style={{ color: 'var(--foreground)' }}>
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" style={{ color: 'var(--primary)' }} />
                        {log.user_email}
                      </span>
                    </td>
                    <td className="px-6 py-4 white-space-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: 'var(--emerald-glow)', color: 'var(--primary)' }}>
                        <Activity className="w-3 h-3" />
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4" style={{ color: 'var(--text-muted)' }}>
                      {log.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
