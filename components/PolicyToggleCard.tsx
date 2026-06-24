'use client';

import { useState } from 'react';
import { ToggleLeft, ToggleRight, ShieldCheck, ShieldAlert } from 'lucide-react';

const DEFAULT_POLICIES = [
  { id: 'web', label: 'Filtro web', enabled: true, detail: 'Bloquea categorías no educativas' },
  { id: 'apps', label: 'Apps no autorizadas', enabled: false, detail: 'Restringe instaladores y juegos' },
  { id: 'night', label: 'Modo nocturno', enabled: true, detail: 'Reduce uso fuera de horario' },
];

export default function PolicyToggleCard() {
  const [policies, setPolicies] = useState(DEFAULT_POLICIES);

  return (
    <section className="rounded-xl border border-white/10 bg-slate-950/60 p-5">
      <div className="mb-4 flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-emerald-300" />
        <h3 className="text-sm font-semibold text-white">Políticas activas</h3>
      </div>

      <div className="space-y-3">
        {policies.map((policy) => (
          <button
            key={policy.id}
            onClick={() =>
              setPolicies((current) =>
                current.map((item) => (item.id === policy.id ? { ...item, enabled: !item.enabled } : item))
              )
            }
            className="flex w-full items-center justify-between rounded-lg border border-white/8 bg-white/5 px-4 py-3 text-left"
          >
            <div>
              <p className="text-sm font-medium text-white">{policy.label}</p>
              <p className="text-xs text-white/55">{policy.detail}</p>
            </div>
            <span className="flex items-center gap-2 text-xs">
              {policy.enabled ? (
                <>
                  <ToggleRight className="h-5 w-5 text-emerald-300" />
                  <span className="text-emerald-200">Activa</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="h-5 w-5 text-white/45" />
                  <span className="text-white/55">Inactiva</span>
                </>
              )}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-400/15 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-100">
        <ShieldAlert className="h-4 w-4" />
        Aplicación local, sin dependencia de nube corporativa.
      </div>
    </section>
  );
}
