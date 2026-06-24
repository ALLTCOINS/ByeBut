'use client';

import { useState } from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';

export default function PricingCTA({ plan, highlighted }: { plan: string; highlighted?: boolean }) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? 'Error inesperado');
      }
    } catch {
      alert('Falló la conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition ${
        highlighted
          ? 'bg-cyan-300 text-slate-950 hover:bg-white'
          : 'border border-white/10 bg-white/5 text-white hover:border-cyan-300/30 hover:bg-white/10'
      }`}
      disabled={loading}
      onClick={handleSubscribe}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Preparando pago
        </>
      ) : (
        <>
          <ShieldCheck className="h-4 w-4" />
          Suscribirme
        </>
      )}
    </button>
  );
}
