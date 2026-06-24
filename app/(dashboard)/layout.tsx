import type { ReactNode } from 'react';
import { createClient } from '@/lib/supabase/server';
import UserMenu from '@/components/UserMenu';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let fullName = 'Familia ByeBut';
  let email = '';
  let avatarUrl = null;
  let role = 'parent';

  if (user) {
    email = user.email || '';
    role = user.app_metadata?.role || 'parent';
    
    // Fetch profile from db
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, avatar_url')
      .eq('id', user.id)
      .maybeSingle();

    if (profile) {
      fullName = profile.full_name || user.email?.split('@')[0] || 'Familia ByeBut';
      avatarUrl = profile.avatar_url;
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-300 text-slate-950">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-md font-semibold leading-none text-white">ByeBut</span>
              <span className="text-[10px] text-slate-400">Soberanía digital</span>
            </span>
          </Link>

          {user && (
            <UserMenu
              fullName={fullName}
              email={email}
              avatarUrl={avatarUrl}
              role={role}
            />
          )}
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
