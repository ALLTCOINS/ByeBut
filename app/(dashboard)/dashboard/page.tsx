'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import supabase from '@/lib/supabase/client';
import {
  Bell,
  BrainCircuit,
  BookOpenCheck,
  Clock3,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Star,
  TimerReset,
  Users,
  TabletSmartphone,
  LayoutDashboard,
  SlidersHorizontal,
  Smartphone,
} from 'lucide-react';
import KPICard from '@/components/KPICard';
import DeviceLiveTable from '@/components/DeviceLiveTable';
import PolicyToggleCard from '@/components/PolicyToggleCard';
import RulesManagement from '@/components/RulesManagement';
import AgePresetSelector from '@/components/AgePresetSelector';
import BovedaEstelar from '@/components/BovedaEstelar';

type ViewKey = 'resumen' | 'familia' | 'dispositivos' | 'reglas' | 'boveda';

type ChildProfile = {
  id: string;
  name: string;
  age: number;
  avatar_url?: string | null;
  birth_date?: string | null;
  settings?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

type ChildWithMetrics = ChildProfile & {
  focus: number;
  screenMinutes: number;
  status: string;
  recommendation: string;
};

const VIEWS: Array<{ key: ViewKey; label: string; icon: typeof LayoutDashboard }> = [
  { key: 'resumen', label: 'Resumen', icon: LayoutDashboard },
  { key: 'familia', label: 'Familia', icon: Users },
  { key: 'dispositivos', label: 'Dispositivos', icon: Smartphone },
  { key: 'reglas', label: 'Reglas', icon: SlidersHorizontal },
  { key: 'boveda', label: '✦ Bóveda Estelar', icon: Star },
];

function DashboardContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const viewParam = (searchParams.get('view') as ViewKey | null) ?? 'resumen';

  const [subscription, setSubscription] = useState<{ plan?: string; status?: string; [key: string]: unknown } | null>(null);
  const [profileName, setProfileName] = useState('Familia ByeBut');
  const [children, setChildren] = useState<ChildWithMetrics[]>([]);
  const [selectedChild, setSelectedChild] = useState<ChildWithMetrics | null>(null);
  const [activeView, setActiveView] = useState<ViewKey>(viewParam);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activityMetrics, setActivityMetrics] = useState<{ rule_violations: number; total_activities: number } | null>(null);

  const [prevViewParam, setPrevViewParam] = useState<ViewKey>(viewParam);

  if (viewParam !== prevViewParam) {
    setPrevViewParam(viewParam);
    setActiveView(viewParam);
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setLoadError(null);

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const [subscriptionResult, profileResult, childrenResult, activityResult] = await Promise.all([
        supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle(),
        supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .maybeSingle(),
        supabase
          .from('child_profiles')
          .select('*')
          .eq('user_id', user.id),
        supabase.rpc('get_user_activity_summary', { user_uuid: user.id }).single(),
      ]);

      if (subscriptionResult.error) {
        throw subscriptionResult.error;
      }

      if (profileResult.error) {
        throw profileResult.error;
      }

      if (childrenResult.error) {
        throw childrenResult.error;
      }

      setSubscription(subscriptionResult.data);
      setProfileName(profileResult.data?.full_name || user.app_metadata?.full_name || 'Familia ByeBut');

      // Get real activity metrics
      const activityData = (activityResult.data as {
        total_activities?: number;
        apps_opened?: number;
        apps_closed?: number;
        screen_time_minutes?: number;
        rule_violations?: number;
        device_count?: number;
      }) || {
        total_activities: 0,
        apps_opened: 0,
        apps_closed: 0,
        screen_time_minutes: 0,
        rule_violations: 0,
        device_count: 0
      };

      setActivityMetrics({
        rule_violations: activityData.rule_violations ?? 0,
        total_activities: activityData.total_activities ?? 0
      });

      // Transform child profiles to include real metrics
      const childrenWithMetrics: ChildWithMetrics[] = (childrenResult.data || []).map((child: ChildProfile) => {
        // Calculate focus based on activity (higher screen time = lower focus)
        const screenTime = activityData.screen_time_minutes ?? 0;
        const baseFocus = Math.max(0, 100 - (screenTime / 10));
        const focus = Math.round(baseFocus);

        return {
          ...child,
          focus,
          screenMinutes: screenTime,
          status: child.age < 8 ? 'Contenido educativo' : child.age < 13 ? 'En clase' : 'Pausa activa',
          recommendation: child.age < 8
            ? 'Conservar límites y reforzar apps educativas.'
            : child.age < 13
            ? 'Mantener horario actual y extender lectura guiada.'
            : 'Reducir redes 30 min y activar modo tarea por la tarde.',
        };
      });

      setChildren(childrenWithMetrics);
      if (childrenWithMetrics.length > 0) {
        setSelectedChild(childrenWithMetrics[0]);
      }

      setLoading(false);
    };

    fetchDashboardData().catch((error) => {
      console.error('Error loading dashboard data:', error);
      setLoadError('No pudimos cargar tus datos en este momento.');
      setLoading(false);
    });

    if (status === 'success') {
      console.log('✅ Suscripción activada correctamente');
    }
  }, [status]);

  const overallBalance = useMemo(
    () => children.length > 0 ? Math.round(children.reduce((sum: number, child: ChildWithMetrics) => sum + child.focus, 0) / children.length) : 0,
    [children]
  );

  const recommendedAction = selectedChild
    ? selectedChild.focus >= 85
      ? 'Todo estable. Mantener la rutina y revisar solo mañana.'
      : selectedChild.focus >= 70
        ? 'Ajuste suave sugerido. Reducir ocio y sumar una pausa guiada.'
        : 'Conviene intervenir hoy con un límite puntual y horario claro.'
    : 'No hay hijos seleccionados';

  const updateView = (nextView: ViewKey) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', nextView);
    router.replace(`${pathname}?${params.toString()}`);
    setActiveView(nextView);
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-orange-400/80 font-bold">Panel familiar</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">ByeBut en casa</h1>
              <p className="mt-2 max-w-2xl text-sm text-white/65">
                Vista pensada para madres, padres y tutores: equilibrio de tiempo, foco por hijo y reglas simples de aplicar.
              </p>
              <p className="mt-2 text-xs text-white/45">Cuenta: {profileName}</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-2 text-xs font-medium text-sky-300 shadow-sm">
              <Sparkles className="h-4 w-4" />
              Soberanía local activa
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {VIEWS.map((view) => {
              const Icon = view.icon;
              const isActive = activeView === view.key;
              return (
                <button
                  key={view.key}
                  onClick={() => updateView(view.key)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all duration-300 ${
                    isActive && view.key !== 'boveda'
                      ? 'border-orange-500/40 bg-orange-500/10 text-orange-400 shadow-sm shadow-orange-500/10'
                      : isActive && view.key === 'boveda'
                      ? 'border-amber-400/50 bg-gradient-to-r from-orange-500/15 to-amber-400/15 text-amber-300 shadow-md shadow-amber-400/10'
                      : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{view.label}</span>
                </button>
              );
            })}
          </div>
        </header>

        {loadError && (
          <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-100">
            {loadError}
          </div>
        )}

        {loading ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-white/70">
            Cargando datos reales desde Supabase...
          </div>
        ) : (
          <>
            {(activeView === 'resumen' || activeView === 'familia') && (
              <div className="grid gap-4 md:grid-cols-4">
                <KPICard title="Plan" value={subscription?.plan ?? 'Sin plan'} subtitle="Suscripción vigente" icon="shield" variant="amber" />
                <KPICard title="Estado" value={subscription?.status ?? 'Sin estado'} subtitle="Cuenta" icon="activity" variant="amber" />
                <KPICard title="Balance familiar" value={`${overallBalance}%`} subtitle="Promedio de foco" icon="clock" variant="purple" />
                <KPICard title="Alertas" value={String(activityMetrics?.rule_violations ?? 0)} subtitle="Violaciones de reglas" icon="alert" variant="red" />
              </div>
            )}

            {activeView === 'resumen' && (
              <section className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
                <div className="space-y-6">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-orange-400" />
                      <h2 className="text-sm font-semibold text-white">Perfiles familiares</h2>
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                      {children.length === 0 ? (
                        <div className="col-span-full rounded-lg border border-white/10 bg-white/5 px-4 py-8 text-center">
                          <p className="text-sm text-white/70">No hay perfiles de hijos creados aún.</p>
                          <p className="mt-2 text-xs text-white/50">Agrega tu primer hijo para empezar a monitorear su actividad.</p>
                        </div>
                      ) : (
                        children.map((child) => (
                          <button
                            key={child.id}
                            onClick={() => setSelectedChild(child)}
                            className={`rounded-xl border px-4 py-4 text-left transition-all duration-300 ${
                              selectedChild?.id === child.id
                                ? 'border-orange-500/40 bg-orange-500/10 shadow-sm shadow-orange-500/10'
                                : 'border-white/10 bg-white/5 hover:bg-white/10 hover:-translate-y-0.5 hover:shadow-md'
                            }`}
                          >
                            <p className="font-medium text-white">{child.name}</p>
                            <p className="text-xs text-white/55">{child.age} años</p>
                            <p className="mt-3 text-xs text-white/70">{child.status}</p>
                            <p className="mt-2 text-xs text-white/50">{child.recommendation}</p>
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center gap-2">
                        <TimerReset className="h-4 w-4 text-amber-300" />
                        <p className="text-sm font-medium text-white">Tiempo sugerido</p>
                      </div>
                      <p className="mt-3 text-2xl font-semibold text-white">45 min</p>
                      <p className="mt-1 text-xs text-white/55">Para completar tareas del día sin desbordes.</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center gap-2">
                        <BookOpenCheck className="h-4 w-4 text-emerald-300" />
                        <p className="text-sm font-medium text-white">Actividad ideal</p>
                      </div>
                      <p className="mt-3 text-2xl font-semibold text-white">Lectura</p>
                      <p className="mt-1 text-xs text-white/55">Mejor equilibrio entre foco y descanso.</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-sky-400" />
                        <p className="text-sm font-medium text-white">Estado</p>
                      </div>
                      <p className="mt-3 text-2xl font-semibold text-white">Protegido</p>
                      <p className="mt-1 text-xs text-white/55">Reglas locales activas y sincronizadas.</p>
                    </div>
                  </div>

                  <DeviceLiveTable viewMode="family" />
                </div>

                <aside className="space-y-6">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center gap-2">
                      <HeartPulse className="h-4 w-4 text-rose-300" />
                      <h2 className="text-sm font-semibold text-white">Foco del día</h2>
                    </div>
                    <p className="mt-3 text-4xl font-semibold text-white">{selectedChild?.focus ?? 0}%</p>
                    <p className="mt-1 text-sm text-white/60">{selectedChild?.name ?? 'Sin selección'} mantiene una rutina estable.</p>
                    <div className="mt-4 rounded-lg bg-slate-950/70 px-3 py-2 text-xs text-white/65">
                      Tiempo de pantalla hoy: {selectedChild?.screenMinutes ?? 0} min
                    </div>
                    <div className="mt-3 rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-xs text-white/65">
                      Acción recomendada: {recommendedAction}
                    </div>
                  </div>

                  <PolicyToggleCard />
                  <RulesManagement />
                  <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center gap-2">
                      <BrainCircuit className="h-4 w-4 text-violet-300" />
                      <h2 className="text-sm font-semibold text-white">Aplicar reglas por edad</h2>
                    </div>
                    <div className="mt-4">
                      <AgePresetSelector deviceId="demo-family-device" onApplied={() => undefined} />
                    </div>
                  </div>
                </aside>
              </section>
            )}

            {activeView === 'familia' && (
              <section className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-orange-400" />
                    <h2 className="text-sm font-semibold text-white">Estado por hijo</h2>
                  </div>
                  <div className="mt-4 space-y-3">
                    {children.length === 0 ? (
                      <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-8 text-center">
                        <p className="text-sm text-white/70">No hay perfiles de hijos creados aún.</p>
                        <p className="mt-2 text-xs text-white/50">Agrega tu primer hijo para empezar a monitorear su actividad.</p>
                      </div>
                    ) : (
                      children.map((child) => (
                        <div key={child.id} className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-sm font-medium text-white">{child.name}</p>
                              <p className="text-xs text-white/55">{child.age} años</p>
                            </div>
                            <span className="text-xs text-white/60">{child.status}</span>
                          </div>
                          <p className="mt-2 text-xs text-white/55">{child.recommendation}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <PolicyToggleCard />
                  <RulesManagement />
                </div>
              </section>
            )}

            {activeView === 'dispositivos' && (
              <section className="space-y-6">
                <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center gap-2">
                    <TabletSmartphone className="h-4 w-4 text-orange-400" />
                    <h2 className="text-sm font-semibold text-white">Dispositivos vinculados</h2>
                  </div>
                  <p className="mt-3 text-sm text-white/65">
                    Revisá el estado activo y pausado de cada equipo antes de aplicar un cambio.
                  </p>
                </div>
                <DeviceLiveTable viewMode="family" />
              </section>
            )}

            {activeView === 'reglas' && (
              <section className="grid gap-6 lg:grid-cols-2">
                <RulesManagement />
                <div className="space-y-6">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-amber-300" />
                      <h2 className="text-sm font-semibold text-white">Rutina sugerida</h2>
                    </div>
                    <p className="mt-3 text-sm text-white/65">
                      Si un hijo supera el umbral de uso, bajá primero el ocio y luego ajustá la ventana horaria.
                    </p>

                  </div>
                  <AgePresetSelector deviceId="demo-family-device" onApplied={() => undefined} />
                </div>
              </section>
            )}

            {activeView === 'boveda' && (
              <section className="space-y-6">
                <BovedaEstelar />
              </section>
            )}
          </>
        )}

        <div className="flex items-center gap-2 text-xs text-white/55">
          <Bell className="h-3.5 w-3.5" />
          Este panel prioriza balance, acompañamiento y reglas cortas de entender.
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500/80 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
