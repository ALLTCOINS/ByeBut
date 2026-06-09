'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Plan = {
  name: string;
  price: string;
  devices: string;
  features: string[];
  highlighted?: boolean;
};

const plans: Plan[] = [
  {
    name: 'Individual',
    price: '$9.90 / mes',
    devices: '1 dispositivo',
    features: [
      'Control total del tiempo de uso',
      'Tus datos permanecen solo en tu móvil',
      'Sin compartir información con Google, Facebook u otros',
      'Instalación sencilla y sin configuraciones complicadas',
    ],
  },
  {
    name: 'Familiar',
    price: '$14.90 / mes',
    devices: 'Hasta 2 dispositivos',
    features: [
      'Control sincronizado en dos dispositivos',
      'Privacidad garantizada: nada sale de la red familiar',
      'Reportes claros para una paz mental total',
      'El plan más popular – "Más elegido"',
    ],
    highlighted: true,
  },
  {
    name: 'Institucional',
    price: 'Desde $49 / mes',
    devices: 'Más de 2 dispositivos',
    features: [
      'Gestión de varios dispositivos y familias',
      'Privacidad total con datos almacenados localmente',
      'Soporte prioritario y asistencia personalizada',
      'Acceso a API interna para integración propia',
    ],
  },
];

export default function Pricing() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const router = useRouter();

  const handleSubscribe = async (plan: string) => {
    setLoadingPlan(plan);
    try {
      const res = await fetch('/api/mercado-pago/create-preference', {
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
    } catch (e) {
      console.error(e);
      alert('Falló la conexión con el servidor.');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section className="py-16 bg-gray-900 text-gray-100">
      <h1 className="text-4xl font-bold text-center text-primary mb-12">
        Planes y precios
      </h1>

      <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={`flex flex-col p-8 rounded-xl border ${plan.highlighted ? 'border-primary bg-gray-800' : 'border-gray-700'}`}
          >
            <h2 className="text-2xl font-semibold text-center mb-2">
              {plan.name}
            </h2>
            {plan.highlighted && (
              <span className="inline-block self-center mb-4 px-3 py-1 bg-primary text-xs font-medium rounded-full text-gray-900">
                Más elegido
              </span>
            )}
            <p className="text-xl font-bold text-center text-primary mb-1">
              {plan.price}
            </p>
            <p className="text-sm text-center text-slate-400 mb-6">
              {plan.devices}
            </p>
            <ul className="flex-1 mb-6 space-y-2">
              {plan.features.map((feat) => (
                <li key={feat} className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-primary flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feat}
                </li>
              ))}
            </ul>
            <button
              className="mt-auto px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark text-center"
              disabled={!!loadingPlan}
              onClick={() => handleSubscribe(plan.name.toLowerCase())}
            >
              {loadingPlan === plan.name.toLowerCase() ? 'Cargando…' : 'Suscribirme'}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
