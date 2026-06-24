'use client';

import { useState } from 'react';
import { Sparkles, Star, Zap, Shield, Trophy, Lock, CheckCircle2, Clock, ChevronRight } from 'lucide-react';
import { ALIEN_AVATARS } from './AlienAvatar';

/* ── Types ─────────────────────────────────────────────────── */
interface NFTRelic {
  id: string;
  name: string;
  rarity: 'Común' | 'Raro' | 'Épico' | 'Legendario';
  avatarId: string;
  rank: string;
  unlocked: boolean;
  tokensRequired: number;
  tokensOwned: number;
  description: string;
  accessory: string;
}

interface GalacticMission {
  id: string;
  title: string;
  description: string;
  child: string;
  reward: number;
  progress: number;
  total: number;
  completed: boolean;
  icon: typeof Zap;
  accent: string;
}

/* ── Rarity config ──────────────────────────────────────────── */
const RARITY_STYLES: Record<NFTRelic['rarity'], { border: string; bg: string; badge: string; glow: string }> = {
  Común:     { border: 'border-slate-500/40',  bg: 'bg-slate-800/50',    badge: 'bg-slate-700 text-slate-300',           glow: '' },
  Raro:      { border: 'border-sky-500/40',    bg: 'bg-sky-950/30',      badge: 'bg-sky-500/20 text-sky-300',             glow: 'shadow-sky-500/10' },
  Épico:     { border: 'border-violet-500/40', bg: 'bg-violet-950/30',   badge: 'bg-violet-500/20 text-violet-300',       glow: 'shadow-violet-500/15' },
  Legendario:{ border: 'border-amber-400/50',  bg: 'bg-amber-950/20',    badge: 'bg-amber-400/20 text-amber-300',         glow: 'shadow-amber-400/20' },
};

/* ── Static data ───────────────────────────────────────────── */
const CHILDREN_TOKENS: { name: string; tokens: number; focus: number; streak: number; avatarId: string }[] = [
  { name: 'Mateo',  tokens: 340, focus: 86, streak: 7,  avatarId: 'alien_sentinel' },
  { name: 'Luna',   tokens: 210, focus: 72, streak: 3,  avatarId: 'alien_void'     },
  { name: 'Noa',    tokens: 480, focus: 91, streak: 12, avatarId: 'alien_grey'     },
];

const RELICS: NFTRelic[] = [
  {
    id: 'relic_arconte_gris',
    name: 'Gran Arconte Gris',
    rarity: 'Legendario',
    avatarId: 'alien_grey',
    rank: 'Nivel Máximo',
    unlocked: false,
    tokensRequired: 500,
    tokensOwned: 480,
    description: 'El Gris Explorador alcanza su forma definitiva tras 12 días de foco perfectos.',
    accessory: 'Corona de Energía Cuántica',
  },
  {
    id: 'relic_sentinel_alpha',
    name: 'Centinela Alfa Prime',
    rarity: 'Épico',
    avatarId: 'alien_sentinel',
    rank: 'Nivel 3',
    unlocked: true,
    tokensRequired: 300,
    tokensOwned: 340,
    description: 'El Centinela Estelar porta la armadura de datos soberanos y custodia la red familiar.',
    accessory: 'Armadura de Datos',
  },
  {
    id: 'relic_void_hunter',
    name: 'Cazador Nebular',
    rarity: 'Raro',
    avatarId: 'alien_void',
    rank: 'Nivel 2',
    unlocked: false,
    tokensRequired: 250,
    tokensOwned: 210,
    description: 'El Cazador del Vacío evoluciona con un halo de energía oscura tras 3 días consecutivos de equilibrio.',
    accessory: 'Halo de Energía Oscura',
  },
  {
    id: 'relic_reptilian',
    name: 'Reptiliano Ancestral',
    rarity: 'Común',
    avatarId: 'alien_reptilian',
    rank: 'Nivel 1',
    unlocked: true,
    tokensRequired: 100,
    tokensOwned: 340,
    description: 'El Reptiliano Astral despierta su sabiduría milenaria al completar la primera semana de equilibrio.',
    accessory: 'Escamas de Cristal',
  },
  {
    id: 'relic_brain_cosmic',
    name: 'Oráculo Cósmico',
    rarity: 'Épico',
    avatarId: 'alien_brain',
    rank: 'Nivel 3',
    unlocked: false,
    tokensRequired: 400,
    tokensOwned: 210,
    description: 'El Cerebro Cósmico evoluciona en Oráculo cuando la familia alcanza el 90% de balance colectivo.',
    accessory: 'Telepático Neural',
  },
];

const MISSIONS: GalacticMission[] = [
  {
    id: 'm1', child: 'Noa', title: 'Centinela de la Verdad',
    description: 'Mantener foco ≥ 90% durante 15 minutos consecutivos.',
    reward: 20, progress: 13, total: 15, completed: false,
    icon: Shield, accent: 'text-cyan-400',
  },
  {
    id: 'm2', child: 'Mateo', title: 'Guardián del Tiempo',
    description: 'Completar 7 días seguidos dentro del balance de uso.',
    reward: 80, progress: 7, total: 7, completed: true,
    icon: Clock, accent: 'text-emerald-400',
  },
  {
    id: 'm3', child: 'Luna', title: 'Explorador del Conocimiento',
    description: 'Acumular 2 horas de apps educativas esta semana.',
    reward: 50, progress: 74, total: 120, completed: false,
    icon: Star, accent: 'text-violet-400',
  },
  {
    id: 'm4', child: 'Toda la familia', title: 'Soberanía Colectiva',
    description: 'Toda la familia mantiene balance verde el mismo día.',
    reward: 150, progress: 1, total: 3, completed: false,
    icon: Trophy, accent: 'text-amber-400',
  },
];

/* ── Sub-components ─────────────────────────────────────────── */
function TokenBadge({ tokens }: { tokens: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/15 border border-orange-500/25 px-2.5 py-1 text-xs font-bold text-orange-300">
      <Sparkles className="h-3 w-3" />
      {tokens.toLocaleString()} GT
    </span>
  );
}

function ChildTokenCard({ child }: { child: typeof CHILDREN_TOKENS[0] }) {
  const avatar = ALIEN_AVATARS.find(a => a.id === child.avatarId);
  return (
    <div className="group relative rounded-2xl border border-white/8 bg-white/5 p-4 backdrop-blur-sm transition-all duration-300 hover:border-orange-500/30 hover:bg-orange-500/5 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`relative h-11 w-11 rounded-full bg-gradient-to-br ${avatar?.color ?? 'from-slate-600 to-slate-800'} p-1 shrink-0`}>
          {avatar?.svg}
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[8px] font-black text-white shadow-md">
            {child.streak}
          </span>
        </div>
        <div>
          <p className="text-sm font-bold text-white">{child.name}</p>
          <p className="text-[10px] text-white/50">Racha: {child.streak} días 🔥</p>
        </div>
        <TokenBadge tokens={child.tokens} />
      </div>
      {/* Focus bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[10px] text-white/50">
          <span>Foco del día</span>
          <span className={child.focus >= 85 ? 'text-emerald-400 font-bold' : child.focus >= 70 ? 'text-amber-400 font-bold' : 'text-rose-400 font-bold'}>
            {child.focus}%
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${child.focus >= 85 ? 'bg-gradient-to-r from-emerald-400 to-cyan-400' : child.focus >= 70 ? 'bg-gradient-to-r from-amber-400 to-orange-400' : 'bg-gradient-to-r from-rose-500 to-pink-500'}`}
            style={{ width: `${child.focus}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function RelicCard({ relic }: { relic: NFTRelic }) {
  const avatar = ALIEN_AVATARS.find(a => a.id === relic.avatarId);
  const style = RARITY_STYLES[relic.rarity];
  const progressPct = Math.min(100, Math.round((relic.tokensOwned / relic.tokensRequired) * 100));

  return (
    <div className={`group relative rounded-2xl border ${style.border} ${style.bg} p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${style.glow} overflow-hidden`}>
      {/* Legendary shimmer */}
      {relic.rarity === 'Legendario' && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-400/5 via-transparent to-amber-600/5 animate-pulse" />
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${style.badge}`}>
          {relic.rarity}
        </span>
        {relic.unlocked ? (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
            <CheckCircle2 className="h-3 w-3" /> Desbloqueada
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-white/40">
            <Lock className="h-3 w-3" /> {relic.tokensRequired - relic.tokensOwned} GT restantes
          </span>
        )}
      </div>

      {/* Avatar */}
      <div className={`mx-auto h-20 w-20 rounded-2xl bg-gradient-to-br ${avatar?.color ?? 'from-slate-600 to-slate-800'} p-2 mb-4 ${!relic.unlocked ? 'opacity-60 grayscale' : 'group-hover:scale-105 transition-transform duration-300'}`}>
        {avatar?.svg}
      </div>

      {/* Name & rank */}
      <div className="text-center mb-3">
        <p className="font-bold text-white text-sm leading-tight">{relic.name}</p>
        <p className="text-[10px] text-white/50 mt-0.5">{relic.rank}</p>
        <p className="text-[10px] text-white/40 mt-1 italic">{relic.accessory}</p>
      </div>

      {/* Description */}
      <p className="text-[11px] text-white/55 text-center mb-4 leading-relaxed">{relic.description}</p>

      {/* Progress */}
      {!relic.unlocked && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] text-white/45">
            <span className="flex items-center gap-1"><Sparkles className="h-2.5 w-2.5 text-orange-400" />{relic.tokensOwned} / {relic.tokensRequired} GT</span>
            <span>{progressPct}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${relic.rarity === 'Legendario' ? 'bg-gradient-to-r from-amber-400 to-yellow-300' : relic.rarity === 'Épico' ? 'bg-gradient-to-r from-violet-500 to-fuchsia-400' : 'bg-gradient-to-r from-sky-500 to-cyan-400'}`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {relic.unlocked && (
        <button className={`w-full rounded-xl py-2 text-xs font-bold transition-all duration-200 ${relic.rarity === 'Legendario' ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:from-amber-400 hover:to-yellow-300' : 'bg-white/10 text-white hover:bg-white/15'}`}>
          {relic.rarity === 'Legendario' ? '✨ Equipar Reliquia' : 'Equipar Avatar'}
        </button>
      )}
    </div>
  );
}

function MissionCard({ mission }: { mission: GalacticMission }) {
  const Icon = mission.icon;
  const pct = Math.round((mission.progress / mission.total) * 100);
  return (
    <div className={`rounded-xl border transition-all duration-200 p-4 ${mission.completed ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/8 bg-white/5 hover:border-white/15 hover:bg-white/8'}`}>
      <div className="flex items-start gap-3">
        <div className={`rounded-xl p-2 ${mission.completed ? 'bg-emerald-500/15' : 'bg-white/8'}`}>
          <Icon className={`h-4 w-4 ${mission.completed ? 'text-emerald-400' : mission.accent}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <p className="text-sm font-semibold text-white">{mission.title}</p>
            <TokenBadge tokens={mission.reward} />
          </div>
          <p className="text-[11px] text-white/50 mt-0.5">{mission.child}</p>
          <p className="text-xs text-white/55 mt-1.5 leading-relaxed">{mission.description}</p>
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-[10px] text-white/40">
              <span>{mission.completed ? '¡Completada!' : `${mission.progress} / ${mission.total}`}</span>
              <span>{pct}%</span>
            </div>
            <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${mission.completed ? 'bg-emerald-400' : 'bg-gradient-to-r from-orange-400 to-amber-300'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>
        {mission.completed && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />}
      </div>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────── */
export default function BóvedaEstelar() {
  const [activeTab, setActiveTab] = useState<'tokens' | 'reliquias' | 'misiones'>('tokens');
  const totalTokens = CHILDREN_TOKENS.reduce((s, c) => s + c.tokens, 0);
  const unlockedRelics = RELICS.filter(r => r.unlocked).length;
  const completedMissions = MISSIONS.filter(m => m.completed).length;

  return (
    <section className="rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-950/20 via-slate-950/40 to-amber-950/10 backdrop-blur-md overflow-hidden">
      {/* ── Header ── */}
      <div className="relative border-b border-white/8 p-6">
        {/* Background stars */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute h-0.5 w-0.5 rounded-full bg-orange-300/30 animate-pulse"
              style={{ left: `${(i * 37 + 5) % 95}%`, top: `${(i * 53 + 10) % 80}%`, animationDelay: `${i * 0.4}s` }}
            />
          ))}
        </div>

        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Star className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-lg font-bold text-white">Bóveda Estelar</h2>
              <span className="rounded-full border border-orange-400/30 bg-orange-400/10 px-2 py-0.5 text-[10px] font-bold text-orange-300 uppercase tracking-widest">Beta</span>
            </div>
            <p className="text-sm text-white/55 max-w-md">
              Coleccionables alienígenas que evolucionan con el buen uso digital de cada hijo. Privados, soberanos y tuyos.
            </p>
          </div>
          <div className="flex gap-4 text-center">
            <div className="rounded-xl border border-orange-500/20 bg-orange-500/8 px-4 py-3">
              <p className="text-2xl font-black text-orange-300">{totalTokens.toLocaleString()}</p>
              <p className="text-[10px] text-white/45 mt-0.5">GuardTokens</p>
            </div>
            <div className="rounded-xl border border-violet-500/20 bg-violet-500/8 px-4 py-3">
              <p className="text-2xl font-black text-violet-300">{unlockedRelics}/{RELICS.length}</p>
              <p className="text-[10px] text-white/45 mt-0.5">Reliquias</p>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-4 py-3">
              <p className="text-2xl font-black text-emerald-300">{completedMissions}/{MISSIONS.length}</p>
              <p className="text-[10px] text-white/45 mt-0.5">Misiones</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="relative mt-5 flex gap-1 border border-white/8 rounded-xl p-1 w-fit bg-black/20">
          {(['tokens', 'reliquias', 'misiones'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold capitalize transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 shadow-md'
                  : 'text-white/55 hover:text-white'
              }`}
            >
              {tab === 'tokens' ? '✦ GuardTokens' : tab === 'reliquias' ? '🛸 Reliquias' : '⚡ Misiones'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="p-6">

        {/* TOKENS TAB */}
        {activeTab === 'tokens' && (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-3">
              {CHILDREN_TOKENS.map(child => (
                <ChildTokenCard key={child.name} child={child} />
              ))}
            </div>

            {/* IA Mentor hint */}
            <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 flex items-start gap-3">
              <div className="h-8 w-8 shrink-0 rounded-lg bg-violet-500/15 flex items-center justify-center">
                <Zap className="h-4 w-4 text-violet-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Mentor Guard IA</p>
                <p className="text-xs text-white/55 mt-0.5 leading-relaxed">
                  Noa está a <strong className="text-amber-300">20 GuardTokens</strong> de desbloquear el <strong className="text-amber-300">Gran Arconte Gris</strong>. Sugerencia: activar una misión de foco de 15 minutos esta tarde.
                </p>
              </div>
              <button className="shrink-0 flex items-center gap-1 text-[11px] text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                Ver <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            {/* How tokens are earned */}
            <div className="grid gap-3 sm:grid-cols-3 text-xs">
              {[
                { icon: '🎯', label: 'Balance diario', value: '+10 GT por día de foco verde' },
                { icon: '🔥', label: 'Racha semanal', value: '+50 GT por 7 días seguidos' },
                { icon: '🏫', label: 'Misión de clase', value: '+20 GT por Modo Clase completado' },
              ].map(item => (
                <div key={item.label} className="rounded-xl border border-white/8 bg-white/5 px-4 py-3 flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-white/80">{item.label}</p>
                    <p className="text-white/45 mt-0.5">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RELIQUIAS TAB */}
        {activeTab === 'reliquias' && (
          <div className="space-y-4">
            <p className="text-xs text-white/45">
              Las Reliquias del Cosmos son coleccionables privados — almacenados localmente, sin blockchain externa. Son propiedad total de tu familia.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {RELICS.map(relic => (
                <RelicCard key={relic.id} relic={relic} />
              ))}
            </div>
          </div>
        )}

        {/* MISIONES TAB */}
        {activeTab === 'misiones' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-white/45">
                Las misiones galácticas son sugeridas por Guard IA en base al comportamiento de cada hijo.
              </p>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1">
                {completedMissions} completadas
              </span>
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
              {MISSIONS.map(mission => (
                <MissionCard key={mission.id} mission={mission} />
              ))}
            </div>
            <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 flex items-center gap-3">
              <Trophy className="h-5 w-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-sm font-bold text-white">¡Misión Épica disponible!</p>
                <p className="text-xs text-white/55 mt-0.5">
                  Si toda la familia mantiene balance verde mañana, desbloquean la <strong className="text-amber-300">Misión: Soberanía Colectiva (+150 GT)</strong>.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
