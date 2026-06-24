'use client';

import { useMemo, useState } from 'react';
import { Smartphone, TabletSmartphone, Laptop, Filter, Loader2, RefreshCw, Play, Pause } from 'lucide-react';
import useDevices from '@/hooks/useDevices';

type ViewMode = 'family' | 'school' | 'enterprise' | 'ceibal';

interface DeviceRow {
  id?: string;
  name: string;
  owner: string;
  status: string;
  activity: string;
  signal: string;
  risk: string;
  is_active?: boolean;
}

interface DeviceSourceRow {
  id: string;
  name: string;
  owner?: string | null;
  status?: string;
  activity?: string;
  signal?: string;
  risk?: string;
  is_active?: boolean;
  platform?: string | null;
  device_type?: string | null;
}

interface DeviceLiveTableProps {
  viewMode: ViewMode;
  filterId?: string;
  devices?: DeviceSourceRow[];
}

const DEVICE_FIXTURES = {
  family: [
    { name: 'Mateo - Tablet', owner: 'Mateo', status: 'active', activity: 'Aprendizaje guiado', signal: 'Local', risk: 'Bajo' },
    { name: 'Luna - Laptop', owner: 'Luna', status: 'paused', activity: 'Modo descanso', signal: 'P2P', risk: 'Bajo' },
    { name: 'Casa - TV', owner: 'Familia', status: 'active', activity: 'Contenido educativo', signal: 'Local', risk: 'Bajo' },
  ],
  school: [
    { name: 'Aula 3A - 01', owner: '3er Año A', status: 'active', activity: 'Matemáticas', signal: 'LAN', risk: 'Medio' },
    { name: 'Aula 3A - 02', owner: '3er Año A', status: 'active', activity: 'Lectura', signal: 'LAN', risk: 'Bajo' },
    { name: 'Aula 3A - 03', owner: '3er Año A', status: 'paused', activity: 'Examen', signal: 'LAN', risk: 'Bajo' },
  ],
  enterprise: [
    { name: 'DEV-LAPTOP-04', owner: 'Desarrollo / TI', status: 'active', activity: 'Compilación en curso', signal: 'P2P', risk: 'Bajo' },
    { name: 'SALES-MOBILE-11', owner: 'Ventas', status: 'active', activity: 'Correo corporativo', signal: 'VPN local', risk: 'Medio' },
    { name: 'FINANCE-03', owner: 'Finanzas', status: 'paused', activity: 'Sincronización pendiente', signal: 'LAN', risk: 'Alto' },
  ],
  ceibal: [
    { name: 'CEIBAL-MVD-120', owner: 'Escuela N°120', status: 'active', activity: 'Clase nacional', signal: 'Regional', risk: 'Bajo' },
    { name: 'CEIBAL-UTU-215', owner: 'UTU Maldonado', status: 'active', activity: 'Uso educativo', signal: 'Regional', risk: 'Bajo' },
    { name: 'CEIBAL-RURAL-045', owner: 'Escuela Rural 45', status: 'paused', activity: 'Mantenimiento', signal: 'Local primero', risk: 'Medio' },
  ],
};

const iconMap = {
  family: Smartphone,
  school: TabletSmartphone,
  enterprise: Laptop,
  ceibal: Laptop,
};

export default function DeviceLiveTable({ viewMode, devices: passedDevices }: DeviceLiveTableProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused'>('all');
  const Icon = iconMap[viewMode];

  const { devices, loading: hookLoading, error: hookError } = useDevices();

  const [toggling, setToggling] = useState<string | null>(null);
  
  // To allow optimistic updates, we keep track of toggled states locally
  const [optimisticStatus, setOptimisticStatus] = useState<Record<string, string>>({});

  const toggleDeviceState = async (row: DeviceRow) => {
    if (!row.id) return;
    setToggling(row.id);
    try {
      const currentStatus = optimisticStatus[row.id] || row.status;
      const newAction = currentStatus === 'active' ? 'pause_device' : 'resume_device';
      const response = await fetch('/api/family/remote-control', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          device_id: row.id,
          action: newAction,
        }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result?.error || 'No se pudo enviar el comando remoto');
      }
      
      // Update local state optimistically
      setOptimisticStatus(prev => ({
        ...prev,
        [row.id!]: currentStatus === 'active' ? 'paused' : 'active'
      }));
    } catch (err: unknown) {
      console.error('Error al pausar/activar dispositivo:', err);
    } finally {
      setToggling(null);
    }
  };

  const rows = useMemo(() => {
    let sourceData = DEVICE_FIXTURES[viewMode];
    if (passedDevices) {
      sourceData = passedDevices.map((device) => {
        if (device.status && device.activity && device.signal && device.risk) return device;
        return {
          id: device.id,
          name: device.name,
          owner: device.owner ?? 'Usuario',
          status: device.is_active ? 'active' : 'paused',
          activity: device.platform ?? device.device_type ?? 'Sin actividad',
          signal: viewMode === 'enterprise' ? 'LAN' : viewMode === 'ceibal' ? 'Regional' : 'Local',
          risk: device.is_active ? 'Bajo' : 'Medio',
        };
      });
    } else if (devices && devices.length > 0) {
      sourceData = devices.map((device) => ({
        id: device.id,
        name: device.name,
        owner: device.owner ?? 'Usuario',
        status: device.is_active ? 'active' : 'paused',
        activity: device.platform ?? device.device_type ?? 'Sin actividad',
        signal: viewMode === 'enterprise' ? 'LAN' : viewMode === 'ceibal' ? 'Regional' : 'Local',
        risk: device.is_active ? 'Bajo' : 'Medio',
      }));
    }
    
    // Apply optimistic updates
    return sourceData.map((row) => {
      if (row.id && optimisticStatus[row.id]) {
        return { ...row, status: optimisticStatus[row.id] };
      }
      return row;
    });
  }, [passedDevices, devices, viewMode, optimisticStatus]);

  const loading = passedDevices ? false : hookLoading;
  const error = passedDevices ? null : hookError;

  const filteredRows = useMemo(
    () => rows.filter((row) => statusFilter === 'all' || row.status === statusFilter),
    [rows, statusFilter]
  );

  return (
    <section className="rounded-xl border border-white/10 bg-slate-950/60 p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-cyan-300" />
          <h3 className="text-sm font-semibold text-white">Dispositivos en tiempo real</h3>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Filter className="h-3.5 w-3.5 text-white/60" />
          <button onClick={() => setStatusFilter('all')} className={`rounded-full px-3 py-1 ${statusFilter === 'all' ? 'bg-white text-slate-950' : 'bg-white/8 text-white/70'}`}>Todos</button>
          <button onClick={() => setStatusFilter('active')} className={`rounded-full px-3 py-1 ${statusFilter === 'active' ? 'bg-emerald-400 text-slate-950' : 'bg-white/8 text-white/70'}`}>Activos</button>
          <button onClick={() => setStatusFilter('paused')} className={`rounded-full px-3 py-1 ${statusFilter === 'paused' ? 'bg-amber-300 text-slate-950' : 'bg-white/8 text-white/70'}`}>Pausados</button>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between text-xs text-white/55">
        <span>{loading ? 'Actualizando desde el servidor...' : error ? `Modo local: ${error}` : 'Datos sincronizados con Supabase'}</span>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-1 text-white/70 hover:text-white"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
          Refrescar
        </button>
      </div>

      <div className="space-y-3">
        {filteredRows.map((row) => (
          <div key={row.name} className="group flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/5 p-4 backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:border-white/10">
            <div className="flex items-center gap-4 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-slate-700 to-slate-800 shadow-inner">
                <span className="text-sm font-bold text-white">{row.owner ? row.owner.charAt(0).toUpperCase() : 'U'}</span>
              </div>
              <div>
                <p className="truncate text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">{row.name}</p>
                <p className="text-xs font-medium text-slate-400">{row.owner}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 md:justify-end">
              <div className="hidden lg:flex items-center text-xs font-medium text-slate-300">
                {row.activity}
              </div>
              <div className="h-4 w-px bg-white/10 hidden lg:block mx-2"></div>
              
              <div className="flex items-center gap-1.5 rounded-full bg-slate-900/50 px-3 py-1.5 border border-white/5">
                <div className={`h-2 w-2 rounded-full ${row.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></div>
                <span className="text-xs font-semibold text-slate-200">
                  {row.status === 'active' ? 'En línea' : 'Pausado'}
                </span>
              </div>

              {row.risk === 'Alto' && (
                <span className="rounded-full bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 text-xs font-semibold text-rose-400 hidden sm:inline-block">
                  Riesgo Alto
                </span>
              )}
              {row.risk === 'Medio' && (
                <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-400 hidden sm:inline-block">
                  Riesgo Medio
                </span>
              )}
              
              {/* MDM Action Buttons */}
              <button
                onClick={() => toggleDeviceState(row)}
                disabled={toggling === row.id}
                title={row.status === 'active' ? 'Pausar dispositivo' : 'Reanudar dispositivo'}
                className="p-2 ml-1 hover:bg-white/10 rounded-full transition-colors border border-white/10 disabled:opacity-50"
              >
                {toggling === row.id ? (
                  <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                ) : row.status === 'active' ? (
                  <Pause className="h-4 w-4 text-amber-400" />
                ) : (
                  <Play className="h-4 w-4 text-emerald-400" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredRows.length === 0 && (
        <p className="py-8 text-center text-sm text-white/55">No hay dispositivos para este filtro.</p>
      )}
    </section>
  );
}
