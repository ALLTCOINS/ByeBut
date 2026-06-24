'use client'

export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import supabase from '@/lib/supabase/client'
import AlienAvatar from '@/components/AlienAvatar'
import { 
  LayoutDashboard, 
  Building2, 
  Smartphone, 
  Shield, 
  BarChart3, 
  Settings, 
  Search, 
  Bell, 
  Menu,
  X,
  LogOut,
  AlertTriangle,
  Server,
  Lock,
  Cpu,
  RefreshCw
} from 'lucide-react'
import KPICard from '@/components/KPICard'
import DeviceLiveTable from '@/components/DeviceLiveTable'
import PolicyToggleCard from '@/components/PolicyToggleCard'

type ViewMode = 'overview' | 'departments' | 'devices' | 'security' | 'policies' | 'analytics' | 'settings'

function EnterpriseDashboardContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const viewParam = searchParams.get('view') as ViewMode | null;
  const currentView = viewParam ?? 'overview';

  const handleViewChange = (newView: ViewMode) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', newView);
    router.replace(`${pathname}?${params.toString()}`);
  };
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [profileName, setProfileName] = useState('Administrador Carlos')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const role = user.app_metadata?.role || 'parent'
          if (role !== 'enterprise_admin' && role !== 'admin') {
            if (process.env.NODE_ENV !== 'development') {
              router.push('/dashboard')
              return
            }
          }
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', user.id)
            .maybeSingle()
          
          if (profile) {
            setProfileName(profile.full_name || user.email || 'Administrador Carlos')
            setAvatarUrl(profile.avatar_url || null)
          } else {
            setProfileName(user.email || 'Administrador Carlos')
          }
          setIsAuthorized(true)
        } else {
          if (process.env.NODE_ENV === 'development') {
            setIsAuthorized(true)
          } else {
            router.push('/login')
          }
        }
      } catch (error) {
        console.error('Error verifying enterprise auth:', error)
        if (process.env.NODE_ENV !== 'development') {
          router.push('/login')
        } else {
          setIsAuthorized(true)
        }
      } finally {
        setIsLoading(false)
      }
    };

    checkAuth();
  }, [router]);

  const navigationItems = [
    { id: 'overview', label: 'Resumen TI', icon: LayoutDashboard },
    { id: 'departments', label: 'Departamentos', icon: Building2 },
    { id: 'devices', label: 'Dispositivos activos', icon: Smartphone },
    { id: 'security', label: 'Seguridad y auditoría', icon: Shield },
    { id: 'policies', label: 'Políticas empresariales', icon: Lock },
    { id: 'analytics', label: 'Analíticas de red', icon: BarChart3 },
    { id: 'settings', label: 'Ajustes', icon: Settings },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center premium-grid-bg">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4 neon-text-emerald" />
          <p className="text-gray-300 font-premium">Cargando panel corporativo...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex text-gray-100 premium-grid-bg">
      {/* Sidebar - Desktop */}
      <aside 
        className={`hidden lg:flex flex-col bg-card border-r border-border transition-all duration-300 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-emerald-500 to-green-600 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
              <Cpu className="h-6 w-6 text-background" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="font-bold text-lg neon-text-emerald">ByeBut</h1>
                <p className="text-xs text-muted-foreground">Tecnología corporativa</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => handleViewChange(item.id as ViewMode)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                  currentView === item.id
                    ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20 font-bold'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white hover:translate-x-1'
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <AlienAvatar id={avatarUrl} className="w-10 h-10 shrink-0" fallbackInitial={profileName} />
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{profileName}</p>
                <p className="text-xs text-muted-foreground truncate">Empresa S.A.</p>
              </div>
            )}
            {!sidebarCollapsed && (
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-accent rounded transition-colors shrink-0"
                title="Cerrar sesión"
              >
                <LogOut className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 lg:hidden ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-emerald-500 to-green-500 flex items-center justify-center">
              <Cpu className="h-6 w-6 text-background" />
            </div>
            <div>
              <h1 className="font-bold text-lg neon-text-emerald">ByeBut</h1>
              <p className="text-xs text-muted-foreground">Tecnología corporativa</p>
            </div>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="p-2 hover:bg-accent rounded transition-colors"
            title="Cerrar menú"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => {
                  handleViewChange(item.id as ViewMode)
                  setMobileSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  currentView === item.id
                    ? 'bg-linear-to-r from-emerald-500 to-green-500 text-background'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-card border-b border-border px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-accent rounded transition-colors"
                title="Abrir menú"
                aria-label="Abrir menú"
              >
                <Menu className="h-5 w-5 text-muted-foreground" />
              </button>
              
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:block p-2 hover:bg-accent rounded transition-colors"
                title="Alternar barra lateral"
                aria-label="Alternar barra lateral"
              >
                <Menu className="h-5 w-5 text-muted-foreground" />
              </button>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar departamentos, logs, dispositivos..."
                  className="w-64 lg:w-96 pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:border-emerald-400 focus:outline-none text-sm text-white placeholder:text-muted-foreground transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Server connection status indicator */}
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/30">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-emerald-400">Pasarela P2P: conectada</span>
              </div>

              {/* Notifications */}
              <button 
                className="relative p-2 hover:bg-accent rounded transition-colors border border-border"
                title="Notificaciones"
                aria-label="Notificaciones"
              >
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 lg:p-6">
          {currentView === 'overview' && <EnterpriseOverview />}
          {currentView === 'devices' && <EnterpriseDevices />}
          {currentView === 'security' && <EnterpriseSecurity />}
          {currentView === 'policies' && <EnterprisePolicies />}
          {currentView === 'analytics' && <EnterpriseAnalytics />}
          {currentView === 'departments' && <EnterpriseDepartments />}
        </div>
      </main>
    </div>
  )
}

export default function EnterpriseDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center premium-grid-bg">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4 neon-text-emerald" />
          <p className="text-gray-300 font-premium">Cargando panel corporativo...</p>
        </div>
      </div>
    }>
      <EnterpriseDashboardContent />
    </Suspense>
  )
}

function EnterpriseOverview() {
  const [deviceCount, setDeviceCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeviceCount = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const companyId = user.app_metadata?.company_id;
        let query = supabase.from('devices').select('id', { count: 'exact', head: true });
        
        if (companyId) {
          query = query.eq('company_id', companyId);
        } else {
          query = query.eq('user_id', user.id);
        }

        const { count } = await query;
        setDeviceCount(count || 0);
      } catch (error) {
        console.error('Error fetching device count:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeviceCount();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2 neon-text-green">
          Resumen corporativo
        </h2>
        <p className="text-muted-foreground">
          Soberanía total. Monitoreo de activos corporativos en red descentralizada local.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Dispositivos activos"
          value={loading ? '...' : deviceCount.toString()}
          subtitle="En red P2P local"
          icon="shield"
          variant="green"
          trend={{ value: 12, positive: true }}
        />
        <KPICard
          title="Uso de ancho de banda"
          value="Calculando..."
          subtitle="Este mes"
          icon="clock"
          variant="cyan"
          trend={{ value: 1.8, positive: true }}
        />
        <KPICard
          title="Nivel de seguridad"
          value="99.4%"
          subtitle="Cumplimiento corporativo"
          icon="shield"
          variant="green"
        />
        <KPICard
          title="Alertas de TI"
          value="0"
          subtitle="Ningún riesgo activo"
          icon="alert"
          variant="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DeviceLiveTable viewMode="enterprise" />
        </div>
        <div className="space-y-6">
          <div className="glass-card p-6 border border-border">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Server className="w-5 h-5 text-emerald-400" />
              Soberanía de datos
            </h3>
            <div className="space-y-3 text-sm text-gray-300">
              <p>
                Este dashboard opera de forma **totalmente local**. Los agentes instalados en los dispositivos de tus empleados no utilizan APIs de Microsoft Intune ni Google MDM.
              </p>
              <div className="p-3 bg-background/50 rounded-lg space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Base de datos local:</span>
                  <span className="text-emerald-400">Activa (Postgres)</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Servidor de telemetría:</span>
                  <span className="text-emerald-400">P2P cifrada</span>
                </div>
              </div>
            </div>
          </div>
          <div className="glass-card p-6 border border-border">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-300" />
              Respuesta inmediata
            </h3>
            <p className="text-sm text-muted-foreground">
              Si un dispositivo pasa a riesgo alto, aislarlo de red local y derivarlo al equipo de TI.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function EnterpriseDevices() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Activos corporativos</h2>
          <p className="text-muted-foreground">
            Listado completo de dispositivos registrados en la red local.
          </p>
        </div>
      </div>
      <DeviceLiveTable viewMode="enterprise" />
    </div>
  )
}

interface ActivityLog {
  id: string;
  activity_type: string;
  app_name: string | null;
  description: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  devices: { name: string } | { name: string }[] | null;
}

function EnterpriseSecurity() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLogs([]);
        return;
      }

      // First fetch the company's devices to filter logs properly
      const companyId = user.app_metadata?.company_id;
      let devicesQuery = supabase.from('devices').select('id');
      if (companyId) {
        devicesQuery = devicesQuery.eq('company_id', companyId);
      } else {
        devicesQuery = devicesQuery.eq('user_id', user.id);
      }

      const { data: devices, error: devError } = await devicesQuery;
      if (devError) throw devError;
      if (!devices || devices.length === 0) {
        setLogs([]);
        return;
      }

      const deviceIds = devices.map(d => d.id);

      const { data, error: logsError } = await supabase
        .from('activity_logs')
        .select(`
          id,
          activity_type,
          app_name,
          description,
          metadata,
          created_at,
          devices (
            name
          )
        `)
        .in('device_id', deviceIds)
        .order('created_at', { ascending: false })
        .limit(20);

      if (logsError) throw logsError;
      setLogs(data || []);
    } catch (err) {
      console.error('Error loading activity logs:', err);
      const msg = err instanceof Error ? err.message : 'Error al cargar registros';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initFetch = async () => {
      await fetchLogs();
    };
    initFetch();
  }, [fetchLogs]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Auditoría de seguridad y registros</h2>
        <p className="text-muted-foreground">
          Registro completo de eventos de red e intentos de vulneración local de los dispositivos.
        </p>
      </div>
      <div className="glass-card p-6 border border-border space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-border">
          <h3 className="font-bold text-white">Últimos registros de seguridad</h3>
          <button 
            onClick={fetchLogs} 
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-emerald-400 hover:underline disabled:opacity-55"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refrescar Logs
          </button>
        </div>
        <div className="space-y-3 font-mono text-xs text-gray-400">
          {loading ? (
            <p className="text-center py-4 text-white/50">Cargando registros reales...</p>
          ) : error ? (
            <p className="text-center py-4 text-rose-350/70">Error: {error}</p>
          ) : logs.length === 0 ? (
            <div className="text-center py-6 text-white/45">
              <p>No se encontraron registros de actividad en esta red.</p>
              <p className="text-[10px] mt-1 text-white/30">Crea o actualiza la actividad de los dispositivos para ver los logs en tiempo real.</p>
            </div>
          ) : (
            logs.map((log) => {
              const date = new Date(log.created_at);
              const timeString = date.toLocaleTimeString();
              const deviceName = Array.isArray(log.devices) ? log.devices[0]?.name : log.devices?.name;
              const displayDeviceName = deviceName || 'Dispositivo';
              
              let badgeColor = 'text-gray-300';
              if (log.activity_type === 'app_open' || log.activity_type === 'app_close') badgeColor = 'text-emerald-400';
              if (log.activity_type === 'notification') badgeColor = 'text-amber-400';
              if (log.activity_type === 'other') badgeColor = 'text-cyan-400';
              
              return (
                <p key={log.id} className="p-2 bg-background/40 rounded flex flex-wrap gap-4 items-center">
                  <span className="text-emerald-500">[{timeString}]</span>
                  <span className={`font-semibold ${badgeColor}`}>[{log.activity_type.toUpperCase()}]</span>
                  <span className="text-white/80">{displayDeviceName}:</span>
                  <span>{log.description || `Acción en ${log.app_name || 'app'}`}</span>
                </p>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function EnterprisePolicies() {
  return (
    <div className="space-y-6">
      <div>
          <h2 className="text-2xl font-bold text-white mb-2">Políticas corporativas</h2>
        <p className="text-muted-foreground">
          Configura bloqueos y reglas de seguridad para todos los departamentos.
        </p>
      </div>
      <PolicyToggleCard />
    </div>
  )
}

function EnterpriseAnalytics() {
  return (
    <div className="space-y-6">
      <div>
          <h2 className="text-2xl font-bold text-white mb-2">Análisis de red</h2>
        <p className="text-muted-foreground">
          Visualiza el uso de red y bloqueos locales de publicidad o contenido indebido.
        </p>
      </div>
      <div className="glass-card p-12 text-center border border-border">
        <BarChart3 className="h-12 w-12 mx-auto mb-4 text-emerald-400 opacity-50" />
        <h3 className="text-lg font-semibold text-white mb-2">Tráfico de red</h3>
        <p className="text-muted-foreground">
          Gráficos detallados de telemetría P2P local.
        </p>
      </div>
    </div>
  )
}

function EnterpriseDepartments() {
  const [departments, setDepartments] = useState<Array<{ id: string; name: string; description?: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const companyId = user.app_metadata?.company_id;
        let query = supabase.from('departments').select('id, name, description');
        
        if (companyId) {
          query = query.eq('company_id', companyId);
        }

        const { data } = await query;
        setDepartments(data || []);
      } catch (error) {
        console.error('Error fetching departments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Departamentos de la empresa</h2>
        <p className="text-muted-foreground">
          Administración y segmentación de reglas por área.
        </p>
      </div>
      {loading ? (
        <div className="glass-card p-6 border border-border text-center">
          <p className="text-sm text-white/70">Cargando departamentos...</p>
        </div>
      ) : departments.length === 0 ? (
        <div className="glass-card p-6 border border-border text-center">
          <p className="text-sm text-white/70">No hay departamentos creados aún.</p>
          <p className="mt-2 text-xs text-white/50">Crea departamentos para organizar tus dispositivos por área.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dep) => (
            <div key={dep.id} className="group rounded-2xl border border-white/5 bg-slate-900/50 p-6 backdrop-blur-md shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-emerald-500/30 hover:bg-slate-900/70 cursor-pointer">
              <h4 className="font-bold text-white text-lg mb-2 transition-colors group-hover:text-emerald-400">{dep.name}</h4>
              {dep.description && <p className="text-xs text-slate-400 mt-2">{dep.description}</p>}
              <div className="flex justify-between text-sm text-slate-400 mt-4">
                <span className="font-medium">Dispositivos: <span className="text-white">-</span></span>
                <span className="font-medium">Reglas activas: <span className="text-white">-</span></span>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="glass-card p-6 border border-border">
        <h3 className="text-lg font-bold text-white mb-2">Acción por departamento</h3>
        <p className="text-sm text-muted-foreground">
          Crear un lote de reglas por área y revisar el inventario de dispositivos antes de ampliar permisos.
        </p>
      </div>
    </div>
  )
}
