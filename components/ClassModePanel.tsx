'use client';
import { useState } from 'react';
import { GraduationCap, BookOpen, PenLine, X, Loader2 } from 'lucide-react';
import { useDevices } from '@/hooks/useDevices';
import toast from 'react-hot-toast';

type ClassMode = 'clase' | 'examen' | 'tarea' | 'off';

const MODES: { key: ClassMode; label: string; icon: React.ReactNode; color: string; desc: string }[] = [
  { key: 'clase', label: 'Modo clase', icon: <GraduationCap className="w-5 h-5" />, color: 'bg-blue-600 hover:bg-blue-500', desc: 'Solo la URL de la clase activa' },
  { key: 'examen', label: 'Modo examen', icon: <PenLine className="w-5 h-5" />, color: 'bg-red-600 hover:bg-red-500', desc: 'Bloqueo total, solo un sitio permitido' },
  { key: 'tarea', label: 'Modo tarea', icon: <BookOpen className="w-5 h-5" />, color: 'bg-amber-600 hover:bg-amber-500', desc: 'Solo sitios educativos' },
  { key: 'off', label: 'Modo normal', icon: <X className="w-5 h-5" />, color: 'bg-gray-600 hover:bg-gray-500', desc: 'Desactivar restricciones especiales' },
];

export default function ClassModePanel() {
  const { devices } = useDevices();
  const [activeMode, setActiveMode] = useState<ClassMode>('off');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const allIds = devices.map(d => d.id);
  const targetIds = selectedIds.length ? selectedIds : allIds;

  const activate = async (mode: ClassMode) => {
    if (!targetIds.length) { toast.error('No hay dispositivos'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/devices/class-mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device_ids: targetIds,
          mode,
          allowed_url: (mode !== 'off' && url) ? url : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? 'Error'); return; }
      setActiveMode(mode);
      toast.success(`${data.label} activado en ${data.affected} dispositivo${data.affected !== 1 ? 's' : ''}`);
    } catch { toast.error('Error de conexión'); }
    finally { setLoading(false); }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-5">
      <div className="flex items-center gap-3">
        <GraduationCap className="w-6 h-6 text-cyan-400" />
        <div>
          <h3 className="font-semibold text-white">Modo clase / examen</h3>
          <p className="text-xs text-gray-400">Controla el acceso en tiempo real para todo el curso</p>
        </div>
      </div>

      {/* URL input */}
      <div>
        <label className="block text-xs text-gray-400 mb-1">URL permitida (opcional)</label>
        <input
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://ejemplo.edu.uy/..."
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none"
        />
      </div>

      {/* Device selector */}
      {devices.length > 0 && (
        <div>
          <label className="block text-xs text-gray-400 mb-2">Dispositivos ({selectedIds.length ? selectedIds.length : 'todos'})</label>
          <div className="flex gap-2 flex-wrap">
            {devices.map(d => (
              <button
                key={d.id}
                onClick={() => setSelectedIds(prev =>
                  prev.includes(d.id) ? prev.filter(x => x !== d.id) : [...prev, d.id]
                )}
                className={`px-2 py-1 rounded-lg text-xs transition-colors ${
                  selectedIds.includes(d.id)
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {d.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mode buttons */}
      <div className="grid grid-cols-2 gap-3">
        {MODES.map(m => (
          <button
            key={m.key}
            onClick={() => activate(m.key)}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-white text-sm font-medium transition-all disabled:opacity-50 ${m.color} ${
              activeMode === m.key ? 'ring-2 ring-white/30 scale-95' : ''
            }`}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : m.icon}
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      {activeMode !== 'off' && (
        <div className="text-xs text-center text-cyan-300 bg-cyan-900/20 rounded-lg py-2">
          {MODES.find(m => m.key === activeMode)?.label} activo en {targetIds.length} dispositivo{targetIds.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
