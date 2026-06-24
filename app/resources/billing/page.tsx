import { CreditCard, Mail, ArrowRight, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function BillingSupportPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Volver a recursos
          </Link>
          <div className="mt-8 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-pink-200">Facturación</p>
            <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
              Soporte de pagos y facturación
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-300">
              Información sobre pagos, facturas y gestión de suscripciones con Mercado Pago.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="glass-panel rounded-[1.8rem] border border-white/10 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                  <CreditCard className="h-5 w-5 text-cyan-200" />
                </div>
                <h3 className="text-lg font-semibold text-white">Métodos de pago</h3>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                Aceptamos todos los métodos de pago de Mercado Pago: tarjetas de crédito, débito, dinero en cuenta, 
                y otros métodos locales de LATAM. El checkout es seguro y procesado directamente por Mercado Pago.
              </p>
            </div>

            <div className="glass-panel rounded-[1.8rem] border border-white/10 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                  <Mail className="h-5 w-5 text-cyan-200" />
                </div>
                <h3 className="text-lg font-semibold text-white">Facturación automática</h3>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                Las facturas se generan automáticamente después de cada pago y se envían a tu correo electrónico 
                registrado. Podés descargarlas desde el email o desde tu panel de cuenta.
              </p>
            </div>

            <div className="glass-panel rounded-[1.8rem] border border-white/10 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                  <MessageSquare className="h-5 w-5 text-cyan-200" />
                </div>
                <h3 className="text-lg font-semibold text-white">Cancelar suscripción</h3>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                Podés cancelar tu suscripción en cualquier momento desde el panel de cuenta. Continuarás teniendo 
                acceso hasta el final del período de facturación actual. Sin penalidades.
              </p>
            </div>

            <div className="glass-panel rounded-[1.8rem] border border-white/10 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                  <CreditCard className="h-5 w-5 text-cyan-200" />
                </div>
                <h3 className="text-lg font-semibold text-white">Reembolsos</h3>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                Si no estás satisfecho con el servicio, contactanos dentro de los primeros 7 días para solicitar 
                un reembolso completo. Evaluamos cada caso individualmente.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-semibold text-white">Preguntas frecuentes sobre pagos</h2>
          <div className="mt-8 space-y-4">
            {[
              {
                q: '¿En qué moneda se cobra?',
                a: 'Todos los precios están en USD pero se procesan en tu moneda local a través de Mercado Pago.',
              },
              {
                q: '¿Hay cargos ocultos?',
                a: 'No. El precio que ves es el precio que pagás. Mercado Pago puede aplicar comisiones según tu método de pago.',
              },
              {
                q: '¿Puedo cambiar de plan?',
                a: 'Sí, podés cambiar de plan en cualquier momento desde el panel de cuenta. El cambio se aplica en el próximo ciclo de facturación.',
              },
              {
                q: '¿Ofrecen planes anuales con descuento?',
                a: 'Sí, los planes anuales tienen un 20% de descuento. Contactanos para más información.',
              },
              {
                q: '¿Qué pasa si mi pago falla?',
                a: 'Si el pago falla, te enviaremos un email con instrucciones para actualizar tu método de pago. Tenés 7 días para resolverlo antes de que se suspenda el servicio.',
              },
            ].map((item) => (
              <div key={item.q} className="glass-panel rounded-2xl border border-white/10 p-6">
                <h3 className="text-base font-semibold text-white">{item.q}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-400">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="glass-panel rounded-[2rem] border border-white/10 bg-linear-to-r from-slate-900 to-slate-950 p-10">
            <h2 className="text-2xl font-semibold text-white">¿Necesitás ayuda con tu pago?</h2>
            <p className="mt-3 text-base leading-7 text-slate-400">
              Si tenés problemas técnicos con el checkout, necesitás una factura específica, o querés solicitar un reembolso, contactanos.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="mailto:soporte@byebut.com"
                className="inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
              >
                <Mail className="h-4.5 w-4.5" />
                Email: soporte@byebut.com
              </a>
              <a
                href="https://discord.gg/byebut"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <MessageSquare className="h-4.5 w-4.5" />
                Discord
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
