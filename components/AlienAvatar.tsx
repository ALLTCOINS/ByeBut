/* components/AlienAvatar.tsx */
import React from 'react';

export const ALIEN_AVATARS = [
  {
    id: 'alien_sentinel',
    name: 'Centinela Estelar',
    description: 'Guardián tecnológico del orden en la red familiar. Serio y protector.',
    color: 'from-indigo-600 to-violet-900',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <radialGradient id="sentinel-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="1" />
            <stop offset="100%" stopColor="#4c1d95" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#sentinel-glow)" className="animate-pulse" />
        <rect x="35" y="30" width="30" height="40" rx="6" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="2.5" />
        <line x1="50" y1="20" x2="50" y2="30" stroke="#a78bfa" strokeWidth="3" />
        <circle cx="50" cy="20" r="4" fill="#ec4899" className="animate-ping" />
        <circle cx="50" cy="20" r="3" fill="#f43f5e" />
        <rect x="40" y="45" width="20" height="5" rx="2.5" fill="#f43f5e" />
        <path d="M 38 47 L 30 55" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 62 47 L 70 55" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'alien_reptilian',
    name: 'Reptiliano Astral',
    description: 'Viajero ancestral de las estrellas. Misterioso, sabio y astuto.',
    color: 'from-emerald-600 to-teal-950',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path d="M 50 10 C 25 10 20 40 20 60 C 20 80 35 90 50 90 C 65 90 80 80 80 60 C 80 40 75 10 50 10 Z" fill="#064e3b" stroke="#10b981" strokeWidth="2.5" />
        <path d="M 30 45 C 32 35 42 38 42 45 C 42 50 32 50 30 45 Z" fill="#fbbf24" />
        <path d="M 70 45 C 68 35 58 38 58 45 C 58 50 68 50 70 45 Z" fill="#fbbf24" />
        <line x1="36" y1="41" x2="36" y2="47" stroke="#047857" strokeWidth="2.5" />
        <line x1="64" y1="41" x2="64" y2="47" stroke="#047857" strokeWidth="2.5" />
        <path d="M 45 65 L 50 68 L 55 65" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M 40 75 C 45 80 55 80 60 75" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" fill="none" />
        <polygon points="50,15 50,25 46,20" fill="#047857" />
        <polygon points="40,20 42,28 37,24" fill="#047857" />
        <polygon points="60,20 58,28 63,24" fill="#047857" />
      </svg>
    )
  },
  {
    id: 'alien_grey',
    name: 'Gris Explorador',
    description: 'El clásico visitante galáctico. Curioso, analítico y muy divertido.',
    color: 'from-slate-500 to-slate-800',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path d="M 50 15 C 22 15 15 45 15 65 C 15 80 30 90 50 90 C 70 90 85 80 85 65 C 85 45 78 15 50 15 Z" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
        <path d="M 22 55 C 22 40 40 40 42 55 C 43 65 30 75 22 55 Z" fill="#0f172a" />
        <path d="M 78 55 C 78 40 60 40 58 55 C 57 65 70 75 78 55 Z" fill="#0f172a" />
        <ellipse cx="34" cy="53" rx="3" ry="2" fill="#ffffff" opacity="0.8" />
        <ellipse cx="66" cy="53" rx="3" ry="2" fill="#ffffff" opacity="0.8" />
        <path d="M 48 70 L 50 72 L 52 70" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        <path d="M 45 78 Q 50 82 55 78" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
    )
  },
  {
    id: 'alien_void',
    name: 'Cazador del Vacío',
    description: 'Criatura surgida de los confines del espacio profundo. Extraordinario y audaz.',
    color: 'from-pink-600 to-fuchsia-950',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="void-eyes" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#db2777" />
          </linearGradient>
        </defs>
        <path d="M 50 10 C 25 10 20 35 20 60 C 20 75 35 85 50 85 C 65 85 80 75 80 60 C 80 35 75 10 50 10 Z" fill="#2d063d" stroke="#d946ef" strokeWidth="2" />
        <path d="M 28 48 C 30 40 44 42 42 52 C 40 60 30 55 28 48 Z" fill="url(#void-eyes)" />
        <path d="M 72 48 C 70 40 56 42 58 52 C 60 60 70 55 72 48 Z" fill="url(#void-eyes)" />
        <path d="M 50 40 C 47 48 53 48 50 56" stroke="#d946ef" strokeWidth="1.5" fill="none" />
        <path d="M 38 68 Q 50 78 62 68" stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M 20 25 C 10 15 5 30 15 35" stroke="#d946ef" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M 80 25 C 90 15 95 30 85 35" stroke="#d946ef" strokeWidth="3" strokeLinecap="round" fill="none" />
      </svg>
    )
  },
  {
    id: 'alien_brain',
    name: 'Cerebro Cósmico',
    description: 'Ente de pura energía psíquica y mental. Intelectual, curioso y analítico.',
    color: 'from-cyan-500 to-sky-950',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <radialGradient id="brain-glow" cx="50%" cy="40%" r="40%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0369a1" stopOpacity="0.1" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="url(#brain-glow)" />
        <path d="M 50 25 C 38 25 32 32 32 42 C 32 50 38 52 40 56 C 42 60 45 68 45 74 L 55 74 C 55 68 58 60 60 56 C 62 52 68 50 68 42 C 68 32 62 25 50 25 Z" fill="#083344" stroke="#22d3ee" strokeWidth="2" />
        <path d="M 40 48 Q 43 45 47 48" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M 60 48 Q 57 45 53 48" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" fill="none" />
        <circle cx="43" cy="51" r="2" fill="#06b6d4" />
        <circle cx="57" cy="51" r="2" fill="#06b6d4" />
        <path d="M 50 25 L 50 74" stroke="#0891b2" strokeWidth="1.5" strokeDasharray="3 3" />
        <path d="M 36 38 C 42 38 42 33 46 33" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M 64 38 C 58 38 58 33 54 33" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </svg>
    )
  }
];

interface AlienAvatarProps {
  id: string | null;
  className?: string;
  fallbackInitial?: string;
}

export default function AlienAvatar({ id, className = 'w-10 h-10', fallbackInitial = 'U' }: AlienAvatarProps) {
  const avatar = ALIEN_AVATARS.find((a) => a.id === id);

  if (avatar) {
    return (
      <div className={`relative rounded-full overflow-hidden bg-linear-to-br ${avatar.color} p-1 ${className}`}>
        {avatar.svg}
      </div>
    );
  }

  // Render a standard initials fallback if id is a URL or empty
  if (id && (id.startsWith('http') || id.startsWith('/'))) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={id}
        alt="Avatar"
        className={`rounded-full object-cover border border-slate-700 ${className}`}
      />
    );
  }

  return (
    <div className={`flex items-center justify-center rounded-full bg-linear-to-br from-cyan-500 to-blue-600 font-bold text-white shadow-md ${className}`}>
      {fallbackInitial.charAt(0).toUpperCase()}
    </div>
  );
}
