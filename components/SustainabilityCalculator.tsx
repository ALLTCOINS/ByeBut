'use client';

import { useState, useMemo } from 'react';
import { Leaf, Battery, Zap, TreePine, TrendingDown } from 'lucide-react';

const DEVICE_TYPES = [
  { name: 'Laptop educativa', batteryImpact: 120, co2PerHour: 0.15, energyPerHour: 0.05 },
  { name: 'Tablet', batteryImpact: 60, co2PerHour: 0.08, energyPerHour: 0.03 },
  { name: 'Smartphone', batteryImpact: 25, co2PerHour: 0.04, energyPerHour: 0.01 },
];

export default function SustainabilityCalculator() {
  const [deviceCount, setDeviceCount] = useState(10);
  const [hoursPerDay, setHoursPerDay] = useState(6);
  const [daysPerMonth, setDaysPerMonth] = useState(20);
  const [selectedDevice, setSelectedDevice] = useState(DEVICE_TYPES[0]);

  const impact = useMemo(() => {
    const totalHours = deviceCount * hoursPerDay * daysPerMonth;
    const batteryCycles = (totalHours / selectedDevice.batteryImpact) * 100;
    const co2Savings = totalHours * selectedDevice.co2PerHour * 0.3; // 30% reduction with ByeBut
    const energySavings = totalHours * selectedDevice.energyPerHour * 0.25; // 25% energy savings
    const treesEquivalent = co2Savings / 21; // 1 tree absorbs ~21kg CO2/year

    return {
      batteryCycles: Math.round(batteryCycles),
      co2Savings: co2Savings.toFixed(2),
      energySavings: energySavings.toFixed(2),
      treesEquivalent: treesEquivalent.toFixed(1),
      totalHours,
    };
  }, [deviceCount, hoursPerDay, daysPerMonth, selectedDevice]);

  return (
    <section className="glass-panel rounded-[2rem] p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3">
            <Leaf className="h-6 w-6 text-emerald-300" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-white">Calculadora de impacto sostenible</h3>
            <p className="mt-1 text-sm text-slate-400">
              Reduciendo el tiempo de pantalla, cuidamos baterías de litio y ahorramos energía
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Tipo de dispositivo predominante
            </label>
            <div className="grid gap-3">
              {DEVICE_TYPES.map((device) => (
                <button
                  key={device.name}
                  onClick={() => setSelectedDevice(device)}
                  className={`rounded-xl border px-4 py-3 text-left transition ${
                    selectedDevice.name === device.name
                      ? 'border-emerald-400/30 bg-emerald-400/10 text-white'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Battery className="h-4 w-4" />
                    <span className="text-sm font-medium">{device.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Cantidad de dispositivos: {deviceCount}
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={deviceCount}
              onChange={(e) => setDeviceCount(Number(e.target.value))}
              className="w-full accent-emerald-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Horas de uso por día: {hoursPerDay}
            </label>
            <input
              type="range"
              min="1"
              max="12"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(Number(e.target.value))}
              className="w-full accent-emerald-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Días por mes: {daysPerMonth}
            </label>
            <input
              type="range"
              min="5"
              max="30"
              value={daysPerMonth}
              onChange={(e) => setDaysPerMonth(Number(e.target.value))}
              className="w-full accent-emerald-400"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-6">
            <div className="flex items-center gap-3">
              <Battery className="h-5 w-5 text-emerald-300" />
              <div>
                <p className="text-xs uppercase tracking-wider text-emerald-200">Ciclos de batería ahorrados</p>
                <p className="mt-1 text-3xl font-semibold text-white">{impact.batteryCycles}</p>
                <p className="mt-1 text-xs text-slate-400">Por mes de uso optimizado</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-6">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-cyan-300" />
              <div>
                <p className="text-xs uppercase tracking-wider text-cyan-200">Energía ahorrada</p>
                <p className="mt-1 text-3xl font-semibold text-white">{impact.energySavings} kWh</p>
                <p className="mt-1 text-xs text-slate-400">Por mes con reducción de uso</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-orange-400/20 bg-orange-400/5 p-6">
            <div className="flex items-center gap-3">
              <TrendingDown className="h-5 w-5 text-orange-300" />
              <div>
                <p className="text-xs uppercase tracking-wider text-orange-200">CO₂ evitado</p>
                <p className="mt-1 text-3xl font-semibold text-white">{impact.co2Savings} kg</p>
                <p className="mt-1 text-xs text-slate-400">Emisiones reducidas por mes</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-green-400/20 bg-green-400/5 p-6">
            <div className="flex items-center gap-3">
              <TreePine className="h-5 w-5 text-green-300" />
              <div>
                <p className="text-xs uppercase tracking-wider text-green-200">Equivalente en árboles</p>
                <p className="mt-1 text-3xl font-semibold text-white">{impact.treesEquivalent} árboles</p>
                <p className="mt-1 text-xs text-slate-400">Capacidad de absorción anual</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
        <p className="font-semibold text-white">¿Cómo funciona?</p>
        <p className="mt-2 text-slate-400">
          ByeBut reduce el tiempo de pantalla innecesario, lo que extiende la vida útil de las baterías de litio,
          disminuye el consumo energético y reduce la huella de carbono. Cada hora optimizada cuenta.
        </p>
      </div>
    </section>
  );
}
