'use client';

import { ArrowUpRight, ArrowDownRight, Activity, Shield, Clock, AlertTriangle } from 'lucide-react';

type KPIVariant = 'cyan' | 'green' | 'purple' | 'red' | 'amber';
type KPIIcon = 'shield' | 'clock' | 'alert' | 'activity';

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: KPIIcon;
  variant?: KPIVariant;
  trend?: { value: number; positive: boolean };
}

const iconVariantMap: Record<KPIVariant, string> = {
  cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  purple: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  red: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

const iconMap = {
  shield: Shield,
  clock: Clock,
  alert: AlertTriangle,
  activity: Activity,
};

export default function KPICard({ title, value, subtitle, icon, variant = 'cyan', trend }: KPICardProps) {
  const Icon = iconMap[icon];

  return (
    <div className="group rounded-2xl border border-white/5 bg-slate-900/40 p-5 backdrop-blur-md shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-slate-900/60">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className={`rounded-xl border p-2.5 transition-transform duration-300 group-hover:scale-110 ${iconVariantMap[variant]}`}>
            <Icon className="h-5 w-5" />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${trend.positive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
              {trend.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {trend.value}%
            </div>
          )}
        </div>
        <div>
          <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
          <p className="mt-2 text-sm font-medium text-slate-400">{title}</p>
          {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
