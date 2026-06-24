'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase/client';
import { LogOut, LayoutDashboard, ChevronDown, User as UserIcon, X, Sparkles } from 'lucide-react';
import Link from 'next/link';
import AlienAvatar, { ALIEN_AVATARS } from './AlienAvatar';

interface UserMenuProps {
  fullName: string;
  email: string;
  avatarUrl: string | null;
  role?: string;
}

const ALIEN_PREFIXES = ['Centinela', 'Reptiliano', 'Gris', 'Cazador', 'Viajero', 'Comandante', 'Híbrido', 'Cerebro', 'Explorador', 'Guardián', 'Nómada'];
const ALIEN_SUFFIXES = ['Estelar', 'Astral', 'del Cosmos', 'del Vacío', 'Nebular', 'Galáctico', 'Alfa', 'Quantum', 'Mutante', 'Soberano', 'Solar'];

export default function UserMenu({ fullName, email, avatarUrl, role }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  // Local state for optimistic updates
  const [localName, setLocalName] = useState(fullName);
  const [localAvatar, setLocalAvatar] = useState(avatarUrl);

  const [prevFullName, setPrevFullName] = useState(fullName);
  const [prevAvatarUrl, setPrevAvatarUrl] = useState(avatarUrl);

  // Modal form states
  const [modalName, setModalName] = useState(fullName);
  const [modalAvatar, setModalAvatar] = useState<string | null>(avatarUrl);
  const [customPhotoUrl, setCustomPhotoUrl] = useState(avatarUrl && !avatarUrl.startsWith('alien_') ? avatarUrl : '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  if (fullName !== prevFullName) {
    setPrevFullName(fullName);
    setLocalName(fullName);
    setModalName(fullName);
  }

  if (avatarUrl !== prevAvatarUrl) {
    setPrevAvatarUrl(avatarUrl);
    setLocalAvatar(avatarUrl);
    setModalAvatar(avatarUrl);
    if (avatarUrl && !avatarUrl.startsWith('alien_')) {
      setCustomPhotoUrl(avatarUrl);
    } else {
      setCustomPhotoUrl('');
    }
  }

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push('/login');
  };

  const saveProfileData = async (newName: string, newAvatar: string | null) => {
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user session found');

      const finalAvatar = (newAvatar && newAvatar.trim() !== '') ? newAvatar.trim() : modalAvatar;

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: newName.trim(),
          avatar_url: finalAvatar,
        })
        .eq('id', user.id);

      if (error) throw error;

      // Optimistic update
      setLocalName(newName.trim());
      setLocalAvatar(finalAvatar);
      setSaveStatus('success');

      setTimeout(() => {
        setSaveStatus('idle');
        router.refresh();
      }, 2000);
    } catch (err) {
      console.error('Error saving profile:', err);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRandomizeName = () => {
    const prefix = ALIEN_PREFIXES[Math.floor(Math.random() * ALIEN_PREFIXES.length)];
    const suffix = ALIEN_SUFFIXES[Math.floor(Math.random() * ALIEN_SUFFIXES.length)];
    const number = Math.floor(100 + Math.random() * 900);
    const newName = `${prefix} ${suffix} ${number}`;
    setModalName(newName);
    saveProfileData(newName, customPhotoUrl !== '' ? customPhotoUrl : modalAvatar);
  };

  // Get initial for avatar placeholder
  const initial = localName ? localName.charAt(0).toUpperCase() : email.charAt(0).toUpperCase();

  // Role display label
  const roleLabel = role === 'school_admin' || role === 'teacher'
    ? 'Escuela'
    : role === 'enterprise_admin'
    ? 'Empresa'
    : role === 'ceibal_admin'
    ? 'Plan Ceibal'
    : 'Familiar';

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 rounded-full bg-slate-900 border border-slate-800 p-1.5 pr-4 text-left transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        id="user-menu-button"
        aria-expanded={isOpen ? 'true' : 'false'}
        aria-haspopup="true"
      >
        <AlienAvatar id={localAvatar} className="h-8 w-8 shrink-0 animate-in fade-in duration-300" fallbackInitial={initial} />
        <div className="hidden sm:block">
          <p className="text-xs font-semibold leading-tight text-white">{localName}</p>
          <p className="text-[10px] text-slate-400">{roleLabel}</p>
        </div>
        <ChevronDown className="h-4 w-4 text-slate-400 hidden sm:block" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-800 bg-slate-950/95 p-2 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150 z-50">
          <div className="px-3 py-2 border-b border-slate-800">
            <p className="text-sm font-semibold text-white truncate">{localName}</p>
            <p className="text-xs text-slate-400 truncate">{email}</p>
          </div>

          <div className="py-1">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Mi Dashboard</span>
            </Link>

            <button
              onClick={() => {
                setIsOpen(false);
                setIsProfileModalOpen(true);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-900 hover:text-white transition-colors text-left"
            >
              <UserIcon className="h-4 w-4" />
              <span>Editar Perfil</span>
            </button>
          </div>

          <div className="border-t border-slate-800 pt-1">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      )}

      {/* Edit Profile Modal (Glassmorphic design) */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div 
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950/90 p-6 shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-cyan-400" />
                Configurar Perfil Soberano
              </h2>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-950 hover:text-white transition"
                aria-label="Cerrar modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-5">
              {/* Name field */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="profile-name" className="text-sm font-medium text-slate-300">
                    Nombre completo
                  </label>
                  <button
                    type="button"
                    onClick={handleRandomizeName}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition-colors"
                  >
                    🎲 Randomizar
                  </button>
                </div>
                <input
                  id="profile-name"
                  type="text"
                  required
                  value={modalName}
                  onChange={(e) => setModalName(e.target.value)}
                  onBlur={() => saveProfileData(modalName, customPhotoUrl !== '' ? customPhotoUrl : modalAvatar)}
                  className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                  placeholder="Tu nombre o alias"
                />
              </div>

              {/* Alien Avatars Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Selecciona tu Avatar Alienígena
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {ALIEN_AVATARS.map((avatar) => {
                    const isSelected = modalAvatar === avatar.id && customPhotoUrl === '';
                    return (
                      <button
                        key={avatar.id}
                        type="button"
                        onClick={() => {
                          setModalAvatar(avatar.id);
                          setCustomPhotoUrl('');
                          saveProfileData(modalName, avatar.id);
                        }}
                        className={`group relative rounded-xl border p-2 flex flex-col items-center justify-center transition-all ${
                          isSelected
                            ? 'border-cyan-400 bg-cyan-950/20 shadow-md shadow-cyan-500/10'
                            : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60'
                        }`}
                        title={`${avatar.name}: ${avatar.description}`}
                      >
                        <div className="w-12 h-12">
                          {avatar.svg}
                        </div>
                        <span className="text-[9px] text-slate-400 mt-1 text-center truncate w-full group-hover:text-white transition-colors">
                          {avatar.name.split(' ')[0]}
                        </span>
                        {isSelected && (
                          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-cyan-400 text-[8px] font-bold text-slate-950">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Photo URL */}
              <div>
                <label htmlFor="custom-avatar-url" className="block text-sm font-medium text-slate-300 mb-1.5">
                  O usa una foto de perfil personalizada (URL)
                </label>
                <input
                  id="custom-avatar-url"
                  type="url"
                  value={customPhotoUrl}
                  onChange={(e) => setCustomPhotoUrl(e.target.value)}
                  onBlur={() => saveProfileData(modalName, customPhotoUrl !== '' ? customPhotoUrl : modalAvatar)}
                  className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                  placeholder="https://ejemplo.com/tu-foto.jpg"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Si escribes una URL válida, esta se usará en lugar del avatar alienígena.
                </p>
              </div>

              {/* UI Save Status messages */}
              {saveStatus === 'success' && (
                <p className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-2 text-center">
                  ¡Perfil guardado con éxito! Sincronizando...
                </p>
              )}
              {saveStatus === 'error' && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-2 text-center">
                  Error al guardar los cambios en la base de datos.
                </p>
              )}

              {/* Action buttons */}
              <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="rounded-lg bg-slate-800 hover:bg-slate-700 px-6 py-2 text-sm font-semibold text-white transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
