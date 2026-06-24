'use client'

export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import supabase from '@/lib/supabase/client'
import AlienAvatar from '@/components/AlienAvatar'
import { 
  LayoutDashboard, 
  Users, 
  Smartphone, 
  Brain, 
  Shield, 
  BarChart3, 
  GraduationCap, 
  Settings, 
  Search, 
  Bell, 
  User, 
  ChevronDown, 
  Menu,
  X,
  LogOut,
  FileText,
  Download,
  Calendar,
  Clock
} from 'lucide-react'
import KPICard from '@/components/KPICard'
import DeviceLiveTable from '@/components/DeviceLiveTable'
import ClassModePanel from '@/components/ClassModePanel'
import PolicyToggleCard from '@/components/PolicyToggleCard'
import RulesManagement from '@/components/RulesManagement'
import { getPresetForAge } from '@/lib/age-presets'

type ViewMode = 'overview' | 'classes' | 'devices' | 'clase_mode' | 'policies' | 'analytics' | 'settings'

function SchoolDashboardContent() {
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
  const [profileName, setProfileName] = useState('Prof. Alejandro')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const role = user.app_metadata?.role || 'parent'
          if (role !== 'school_admin' && role !== 'teacher' && role !== 'admin') {
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
            setProfileName(profile.full_name || user.email || 'Prof. Alejandro')
            setAvatarUrl(profile.avatar_url || null)
          } else {
            setProfileName(user.email || 'Prof. Alejandro')
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
        console.error('Error verifying school auth:', error)
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
    { id: 'overview', label: 'Resumen escolar', icon: LayoutDashboard },
    { id: 'classes', label: 'Cursos y grados', icon: Users },
    { id: 'devices', label: 'Dispositivos estudiantiles', icon: Smartphone },
    { id: 'clase_mode', label: 'Modo aula', icon: GraduationCap },
    { id: 'policies', label: 'Políticas escolares', icon: Shield },
    { id: 'analytics', label: 'Analíticas de atención', icon: BarChart3 },
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
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4 neon-text-cyan" />
          <p className="text-gray-300 font-premium">Cargando panel escolar...</p>
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
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20">
              <GraduationCap className="h-6 w-6 text-background" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="font-bold text-lg neon-text-cyan">ByeBut</h1>
                <p className="text-xs text-muted-foreground">Escuelas y colegios</p>
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
                    ? 'bg-linear-to-r from-cyan-500 to-indigo-500 text-white shadow-md shadow-cyan-500/20 font-bold'
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
                <p className="text-xs text-muted-foreground truncate">Colegio San Pedro</p>
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
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-background" />
            </div>
            <div>
              <h1 className="font-bold text-lg neon-text-cyan">ByeBut</h1>
                <p className="text-xs text-muted-foreground">Escuelas y colegios</p>
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
                    ? 'bg-linear-to-r from-cyan-500 to-blue-500 text-background'
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
                  placeholder="Buscar clases, alumnos, dispositivos..."
                  className="w-64 lg:w-96 pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:border-cyan-400 focus:outline-none text-sm text-white placeholder:text-muted-foreground transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Class Switcher */}
              <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-accent rounded-lg border border-border">
                <Users className="h-4 w-4 text-cyan-400" />
                <select 
                  className="bg-transparent text-sm text-white focus:outline-none"
                  title="Seleccionar clase"
                  aria-label="Seleccionar clase"
                >
                  <option>3er grado A</option>
                  <option>4to grado B</option>
                  <option>5to grado C</option>
                </select>
              </div>

              {/* Export Button */}
              <button className="hidden md:flex items-center gap-2 px-3 py-2 bg-linear-to-r from-cyan-500 to-blue-500 rounded-lg text-background font-semibold text-sm hover:opacity-90 transition-opacity">
                <Download className="h-4 w-4" />
                <span>Exportar informe</span>
              </button>

              {/* Notifications */}
              <button 
                className="relative p-2 hover:bg-accent rounded transition-colors border border-border"
                title="Notificaciones"
                aria-label="Notificaciones"
              >
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 rounded-full" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 lg:p-6">
          {currentView === 'overview' && <SchoolOverview />}
          {currentView === 'devices' && <SchoolDevices />}
          {currentView === 'clase_mode' && <SchoolClassMode />}
          {currentView === 'policies' && <SchoolPolicies />}
          {currentView === 'analytics' && <SchoolAnalytics />}
          {currentView === 'classes' && <SchoolClasses />}
        </div>
      </main>
    </div>
  )
}

export default function SchoolDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center premium-grid-bg">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4 neon-text-cyan" />
          <p className="text-gray-300 font-premium">Cargando panel escolar...</p>
        </div>
      </div>
    }>
      <SchoolDashboardContent />
    </Suspense>
  )
}

function SchoolOverview() {
  const [studentCount, setStudentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const suggestedPreset = getPresetForAge(2016);

  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const schoolId = user.app_metadata?.school_id;
        let query = supabase.from('students').select('id', { count: 'exact', head: true });
        
        if (schoolId) {
          // Join through classrooms to filter by school
          const { data: classrooms } = await supabase
            .from('classrooms')
            .select('id')
            .eq('school_id', schoolId);
          
          if (classrooms && classrooms.length > 0) {
            const classroomIds = classrooms.map(c => c.id);
            query = supabase.from('students').select('id', { count: 'exact', head: true }).in('classroom_id', classroomIds);
          }
        }

        const { count } = await query;
        setStudentCount(count || 0);
      } catch (error) {
        console.error('Error fetching student count:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentCount();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2 neon-text-cyan">
          Resumen escolar
        </h2>
        <p className="text-muted-foreground">
          Panel escolar centralizado. Gestiona los dispositivos del aula en tiempo real.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Alumnos Conectados"
          value={loading ? '...' : studentCount.toString()}
          subtitle="En tiempo real"
          icon="shield"
          variant="cyan"
          trend={{ value: 3, positive: true }}
        />
        <KPICard
          title="Atención Promedio"
          value="Calculando..."
          subtitle="Durante esta clase"
          icon="clock"
          variant="green"
          trend={{ value: 5, positive: true }}
        />
        <KPICard
          title="Modo Clase"
          value="Activo"
          subtitle="Seleccionar aula"
          icon="shield"
          variant="purple"
        />
        <KPICard
          title="Alertas Activas"
          value="0"
          subtitle="Intentos de bypass"
          icon="alert"
          variant="red"
          trend={{ value: 1, positive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DeviceLiveTable viewMode="school" />
        </div>
        <div className="space-y-6">
          <div className="glass-card p-6 border border-border">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              Horario Escolar Actual
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-background/50 rounded-lg">
                <span className="text-sm font-medium text-gray-300">Horario no configurado</span>
                <span className="text-xs px-2 py-1 rounded bg-gray-500/20 text-gray-400">Configurar en ajustes</span>
              </div>
            </div>
          </div>
          <div className="glass-card p-6 border border-border">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              Acción sugerida
            </h3>
            <p className="text-sm text-muted-foreground">
              {suggestedPreset
                ? `Aplicar la plantilla ${suggestedPreset.label} para el grupo seleccionado.`
                : 'Revisar manualmente los límites del aula.'}
            </p>
          </div>
          <ClassModePanel />
        </div>
      </div>
    </div>
  )
}

function SchoolDevices() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Dispositivos en el aula</h2>
          <p className="text-muted-foreground">
            Monitoreo en tiempo real de los dispositivos asignados a los alumnos de esta clase.
          </p>
        </div>
      </div>
      <DeviceLiveTable viewMode="school" />
    </div>
  )
}

function SchoolClassMode() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Control de atención (modo aula)</h2>
        <p className="text-muted-foreground">
          Bloquea temporalmente el entretenimiento y las redes sociales para asegurar el foco durante horas lectivas o exámenes.
        </p>
      </div>
      <div className="max-w-3xl">
        <ClassModePanel />
      </div>
    </div>
  )
}

function SchoolPolicies() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Reglas del aula</h2>
        <p className="text-muted-foreground">
          Políticas fijas para el horario escolar de la clase seleccionada.
        </p>
      </div>
      <PolicyToggleCard />
    </div>
  )
}

function SchoolAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Métricas de foco escolar</h2>
        <p className="text-muted-foreground">
          Analiza el porcentaje de atención y desvíos de apps de entretenimiento.
        </p>
      </div>
      <div className="glass-card p-12 text-center border border-border">
        <BarChart3 className="h-12 w-12 mx-auto mb-4 text-cyan-400 opacity-50" />
        <h3 className="text-lg font-semibold text-white mb-2">Atención histórica</h3>
        <p className="text-muted-foreground">
          Visualiza reportes semanales de atención y horas acumuladas de estudio digital.
        </p>
      </div>
    </div>
  )
}

function SchoolClasses() {
  const [classrooms, setClassrooms] = useState<Array<{ id: string; name: string; grade?: string; level?: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const schoolId = user.app_metadata?.school_id;
        let query = supabase.from('classrooms').select('id, name, grade, level');
        
        if (schoolId) {
          query = query.eq('school_id', schoolId);
        } else {
          // If no school_id, show classrooms where user is teacher
          query = query.eq('teacher_id', user.id);
        }

        const { data } = await query;
        setClassrooms(data || []);
      } catch (error) {
        console.error('Error fetching classrooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Mis cursos asignados</h2>
        <p className="text-muted-foreground">
          Gestión de grupos escolares.
        </p>
      </div>
      {loading ? (
        <div className="glass-card p-6 border border-border text-center">
          <p className="text-sm text-white/70">Cargando cursos...</p>
        </div>
      ) : classrooms.length === 0 ? (
        <div className="glass-card p-6 border border-border text-center">
          <p className="text-sm text-white/70">No hay cursos asignados aún.</p>
          <p className="mt-2 text-xs text-white/50">Contacta al administrador para que te asigne a un aula.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classrooms.map((cls) => (
            <div key={cls.id} className="group rounded-2xl border border-white/5 bg-slate-900/50 p-6 backdrop-blur-md shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-cyan-500/30 hover:bg-slate-900/70 cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-white text-lg transition-colors group-hover:text-cyan-300">{cls.name}</h4>
                  {cls.level && <span className="text-xs font-medium text-slate-400">{cls.level}</span>}
                </div>
                <span className="text-xs px-2 py-1 rounded bg-cyan-500/20 text-cyan-400">
                  Activo
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>Grado: {cls.grade || '-'}</span>
                <span className="text-cyan-400 hover:underline">Ver detalles →</span>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="glass-card p-6 border border-border">
        <h3 className="text-lg font-bold text-white mb-2">Próxima intervención</h3>
        <p className="text-sm text-muted-foreground">
          Si el promedio de foco baja de 75%, activa modo aula y aplica una regla de tiempo limitada por 30 minutos.
        </p>
      </div>
    </div>
  )
}
