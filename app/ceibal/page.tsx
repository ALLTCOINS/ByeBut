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
  Brain, 
  Shield, 
  BarChart3, 
  Settings, 
  Search, 
  Bell, 
  User, 
  ChevronDown, 
  Menu,
  X,
  LogOut,
  Download,
  FileText,
  Globe
} from 'lucide-react'
import KPICard from '@/components/KPICard'
import DeviceLiveTable from '@/components/DeviceLiveTable'
import AIInsightPanel from '@/components/AIInsightPanel'
import PolicyToggleCard from '@/components/PolicyToggleCard'

type ViewMode = 'overview' | 'schools' | 'devices' | 'guard_ai' | 'policies' | 'analytics' | 'reports' | 'settings'

function CeibalDashboardContent() {
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
  const [profileName, setProfileName] = useState('Ceibal Admin')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const role = user.app_metadata?.role || 'parent'
          if (role !== 'ceibal_admin' && role !== 'admin') {
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
            setProfileName(profile.full_name || user.email || 'Ceibal Admin')
            setAvatarUrl(profile.avatar_url || null)
          } else {
            setProfileName(user.email || 'Ceibal Admin')
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
        console.error('Error verifying Ceibal auth:', error)
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
    { id: 'overview', label: 'Resumen Ceibal', icon: LayoutDashboard },
    { id: 'schools', label: 'Escuelas', icon: Building2 },
    { id: 'devices', label: 'Dispositivos', icon: Smartphone },
    { id: 'guard_ai', label: 'Guard IA', icon: Brain },
    { id: 'policies', label: 'Políticas globales', icon: Shield },
    { id: 'analytics', label: 'Analíticas Ceibal', icon: BarChart3 },
    { id: 'reports', label: 'Informes estatales', icon: FileText },
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
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4 neon-text-purple" />
          <p className="text-gray-300 font-premium">Cargando panel Ceibal...</p>
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
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
              <Building2 className="h-6 w-6 text-background" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="font-bold text-lg neon-text-purple">ByeBut</h1>
                <p className="text-xs text-muted-foreground">Plan Ceibal, Uruguay</p>
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
                    ? 'bg-linear-to-r from-purple-500 to-violet-500 text-white shadow-md shadow-purple-500/20 font-bold'
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
                <p className="text-xs text-muted-foreground truncate">Uruguay Central</p>
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
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-background" />
            </div>
            <div>
              <h1 className="font-bold text-lg neon-text-purple">ByeBut</h1>
              <p className="text-xs text-muted-foreground">Plan Ceibal</p>
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
                    ? 'bg-linear-to-r from-purple-500 to-indigo-500 text-background'
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
                  placeholder="Buscar escuelas, alumnos, parches..."
                  className="w-64 lg:w-96 pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:border-purple-450 focus:outline-none text-sm text-white placeholder:text-muted-foreground transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Organization switcher */}
              <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-accent rounded-lg border border-border">
                <Globe className="h-4 w-4 text-purple-400" />
                <select 
                  className="bg-transparent text-sm text-white focus:outline-none"
                  title="Seleccionar organización escolar"
                  aria-label="Seleccionar organización escolar"
                >
                  <option>ANEP Central</option>
                  <option>Plan Ceibal</option>
                  <option>Educación Técnica (UTU)</option>
                </select>
              </div>

              {/* Export Button */}
              <button className="hidden md:flex items-center gap-2 px-3 py-2 bg-linear-to-r from-purple-500 to-indigo-500 rounded-lg text-background font-semibold text-sm hover:opacity-90 transition-opacity">
                <Download className="h-4 w-4" />
                <span>Exportar Datos</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 lg:p-6">
          {currentView === 'overview' && <CeibalOverview />}
          {currentView === 'devices' && <CeibalDevices />}
          {currentView === 'guard_ai' && <CeibalGuardAI />}
          {currentView === 'policies' && <CeibalPolicies />}
          {currentView === 'analytics' && <CeibalAnalytics />}
          {currentView === 'reports' && <CeibalReports />}
          {currentView === 'schools' && <CeibalSchools />}
        </div>
      </main>
    </div>
  )
}

export default function CeibalDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center premium-grid-bg">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4 neon-text-purple" />
          <p className="text-gray-300 font-premium">Cargando panel Ceibal...</p>
        </div>
      </div>
    }>
      <CeibalDashboardContent />
    </Suspense>
  )
}

function CeibalOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2 neon-text-purple">
          Resumen central de Plan Ceibal
        </h2>
        <p className="text-muted-foreground">
          Gestión y auditoría del ecosistema escolar digital nacional de Uruguay.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Escuelas Registradas"
          value="412"
          subtitle="A nivel nacional"
          icon="shield"
          variant="purple"
          trend={{ value: 4, positive: true }}
        />
        <KPICard
          title="Dispositivos totales"
          value="18,245"
          subtitle="En el sistema"
          icon="shield"
          variant="cyan"
          trend={{ value: 12, positive: true }}
        />
        <KPICard
          title="Foco colectivo"
          value="945k hs"
          subtitle="Este mes"
          icon="clock"
          variant="green"
          trend={{ value: 8, positive: true }}
        />
        <KPICard
          title="Nivel de cumplimiento"
          value="98.2%"
          subtitle="Políticas estatales"
          icon="shield"
          variant="purple"
        />
      </div>

      {/* Compliance Banner */}
      <div className="glass-card p-6 border border-purple-500/30 bg-purple-500/5">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-purple-500/20">
            <Shield className="h-6 w-6 text-purple-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white mb-1">Certificación oficial Plan Ceibal</h3>
            <p className="text-sm text-muted-foreground">
              ByeBut cumple con los requisitos de privacidad soberana y protección para las redes de Ceibal.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DeviceLiveTable viewMode="ceibal" />
        </div>
        <div className="space-y-6">
          <AIInsightPanel />
          <div className="glass-card p-6 border border-border">
            <h3 className="text-lg font-bold text-white mb-2">Acción masiva</h3>
            <p className="text-sm text-muted-foreground">
              Publicar una política nacional o distribuir una plantilla de reglas a todas las escuelas en minutos.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function CeibalDevices() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Dispositivos de Plan Ceibal</h2>
          <p className="text-muted-foreground">
            Auditoría de todos los dispositivos escolares registrados.
          </p>
        </div>
      </div>
      <DeviceLiveTable viewMode="ceibal" />
    </div>
  )
}

function CeibalGuardAI() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Guard IA estatal</h2>
          <p className="text-muted-foreground">
            Alertas de seguridad y comportamiento predictivo escolar masivo.
          </p>
        </div>
      </div>
      <AIInsightPanel />
    </div>
  )
}

function CeibalPolicies() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Políticas nacionales Ceibal</h2>
        <p className="text-muted-foreground">
          Define políticas obligatorias a nivel estatal para todas las escuelas conectadas.
        </p>
      </div>
      <PolicyToggleCard />
    </div>
  )
}

function CeibalAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Estadísticas nacionales</h2>
        <p className="text-muted-foreground">
          Uso digital, horas de estudio y compliance histórico.
        </p>
      </div>
      <div className="glass-card p-12 text-center border border-border">
        <BarChart3 className="h-12 w-12 mx-auto mb-4 text-purple-400 opacity-50" />
        <h3 className="text-lg font-semibold text-white mb-2">Métricas de foco escolar en Uruguay</h3>
        <p className="text-muted-foreground">
          Datos agregados del Plan Ceibal.
        </p>
      </div>
    </div>
  )
}

function CeibalReports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Reportes Oficiales</h2>
          <p className="text-muted-foreground">
            Generación y descarga de informes de compliance e impacto educativo.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Informe anual de cumplimiento 2025', date: '2026-01-10', status: 'Completado' },
          { title: 'Métricas de foco escolar Ceibal', date: '2026-02-15', status: 'Completado' },
        ].map((rep, index) => (
          <div key={index} className="glass-card p-4 border border-border flex items-start gap-3 hover:border-purple-500/50 transition-colors cursor-pointer">
            <div className="p-2 bg-purple-500/20 rounded">
              <FileText className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">{rep.title}</h4>
              <span className="text-xs text-muted-foreground">{rep.date}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="glass-card p-6 border border-border">
        <h3 className="text-lg font-bold text-white mb-2">Entrega institucional</h3>
        <p className="text-sm text-muted-foreground">
          Preparar un informe ejecutivo para dirección y un resumen técnico para coordinación territorial.
        </p>
      </div>
    </div>
  )
}

function CeibalSchools() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Escuelas Integradas</h2>
        <p className="text-muted-foreground">
          Listado de centros educativos que utilizan el gateway local de ByeBut.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Escuela N° 120 (Montevideo)', devices: 320, region: 'Metropolitana' },
          { name: 'Colegio Técnico UTU Maldonado', devices: 215, region: 'Este' },
          { name: 'Escuela Rural N° 45 (Tacuarembó)', devices: 48, region: 'Norte' },
        ].map((sch, index) => (
          <div key={index} className="group rounded-2xl border border-white/5 bg-slate-900/50 p-6 backdrop-blur-md shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-purple-500/30 hover:bg-slate-900/70 cursor-pointer">
            <h4 className="font-bold text-white text-lg mb-1 transition-colors group-hover:text-purple-400">{sch.name}</h4>
            <span className="text-xs font-medium text-slate-400">Región: {sch.region}</span>
            <div className="flex justify-between text-sm text-slate-400 mt-4">
              <span className="font-medium">Equipos activos: <span className="text-white">{sch.devices}</span></span>
            </div>
          </div>
        ))}
      </div>
      <div className="glass-card p-6 border border-border">
        <h3 className="text-lg font-bold text-white mb-2">Expansión nacional</h3>
        <p className="text-sm text-muted-foreground">
          Priorizar escuelas con menor cobertura para la siguiente ronda de despliegue y mantenimiento.
        </p>
      </div>
    </div>
  )
}
