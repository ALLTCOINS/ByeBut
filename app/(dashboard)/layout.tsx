/* app/(dashboard)/layout.tsx */
import type { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <nav className="p-4 border-b border-slate-800">
        <h1 className="text-xl font-bold">ByeBut Dashboard</h1>
      </nav>
      <main>{children}</main>
    </div>
  );
}
