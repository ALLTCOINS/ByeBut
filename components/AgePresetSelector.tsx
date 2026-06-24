'use client';
import { useState } from 'react';
import { AGE_PRESETS, AgePreset } from '@/lib/age-presets';
import { Wand2, Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  deviceId: string;
  onApplied?: () => void;
}

export default function AgePresetSelector({ deviceId, onApplied }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const [applied, setApplied] = useState<string | null>(null);

  const apply = async (presetKey: string, preset: AgePreset) => {
    setLoading(presetKey);
    try {
      const res = await fetch('/api/rules/apply-preset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device_id: deviceId, preset_key: presetKey }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? 'Error'); return; }
      setApplied(presetKey);
      toast.success(`✅ ${preset.label} aplicado — ${data.rules_created} reglas configuradas`);
      onApplied?.();
    } catch { toast.error('Error de conexión'); }
    finally { setLoading(null); }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Wand2 className="w-5 h-5 text-cyan-400" />
        <div>
          <h4 className="font-semibold text-white text-sm">Configuración por edad</h4>
          <p className="text-xs text-gray-400">Aplica reglas sugeridas según la etapa de crecimiento</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Object.entries(AGE_PRESETS).map(([key, preset]) => (
          <button
            key={key}
            onClick={() => apply(key, preset)}
            disabled={!!loading}
            className={`text-left p-4 rounded-xl border transition-all hover:-translate-y-0.5 disabled:opacity-60 ${
              applied === key
                ? 'border-cyan-500 bg-cyan-900/20'
                : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xl">{preset.emoji}</span>
              {loading === key
                ? <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                : applied === key
                ? <Check className="w-4 h-4 text-cyan-400" />
                : null}
            </div>
            <p className="font-medium text-white text-sm">{preset.label}</p>
            <p className="text-xs text-gray-400">{preset.ageRange} años · {preset.description}</p>
            <ul className="mt-2 space-y-0.5">
              {preset.rules.map(r => (
                <li key={r.label} className="text-xs text-gray-500 flex items-center gap-1">
                  <span className="w-1 h-1 bg-cyan-500 rounded-full flex-shrink-0" />
                  {r.label}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>
    </div>
  );
}
