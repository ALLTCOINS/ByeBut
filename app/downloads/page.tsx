import { Download, ShieldCheck, Terminal, ArrowRight, CheckCircle2, Lock, Copy } from 'lucide-react';
import Link from 'next/link';

const platforms = [
  {
    name: 'Windows',
    icon: '🪟',
    version: '1.2.0',
    size: '45 MB',
    status: 'stable',
    downloadUrl: '#',
    hash: 'sha256:a1b2c3d4e5f6...',
    instructions: [
      'Descargá el instalador .exe',
      'Ejecutá como administrador',
      'Seguí el asistente de instalación',
      'Iniciá sesión con tu cuenta de ByeBut',
    ],
  },
  {
    name: 'macOS',
    icon: '🍎',
    version: '1.2.0',
    size: '52 MB',
    status: 'stable',
    downloadUrl: '#',
    hash: 'sha256:f6e5d4c3b2a1...',
    instructions: [
      'Descargá el instalador .dmg',
      'Arrastrá ByeBut a Applications',
      'Abrí la app y permití acceso',
      'Iniciá sesión con tu cuenta de ByeBut',
    ],
  },
  {
    name: 'Linux',
    icon: '🐧',
    version: '1.2.0',
    size: '38 MB',
    status: 'stable',
    downloadUrl: '#',
    hash: 'sha256:e5f6d4c3b2a1...',
    instructions: [
      'Descargá el .deb (Debian/Ubuntu) o .rpm (Fedora)',
      'Instalá: sudo dpkg -i byebut-agent.deb',
      'Iniciá el servicio: sudo systemctl start byebut-agent',
      'Iniciá sesión con tu cuenta de ByeBut',
    ],
  },
];

const silentInstallInstructions = [
  {
    title: 'Windows (Silent)',
    command: 'byebut-agent-installer.exe /S /DEVICE_ID=xxx /USER_ID=yyy',
    description: 'Instalación silenciosa ideal para despliegues masivos en escuelas y empresas.',
  },
  {
    title: 'macOS (Silent)',
    command: 'sudo installer -pkg byebut-agent.pkg -target /',
    description: 'Instalación vía línea de comandos para MDM y scripts de despliegue.',
  },
  {
    title: 'Linux (Debian/Ubuntu)',
    command: 'sudo DEBIAN_FRONTEND=noninteractive dpkg -i byebut-agent.deb',
    description: 'Instalación no interactiva para automatización con Ansible, Puppet, etc.',
  },
];

const verificationSteps = [
  {
    title: 'Windows',
    command: 'certutil -hashfile byebut-agent-installer.exe SHA256',
  },
  {
    title: 'macOS/Linux',
    command: 'shasum -a 256 byebut-agent-installer.exe',
  },
];

export default function DownloadsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Volver al inicio
          </Link>
          <div className="mt-8 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">Downloads</p>
            <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
              Device Agent - Monitoreo local soberano.
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-300">
              Descargá el agente para tu plataforma. Tus datos se procesan localmente y solo se sincronizan con tu consentimiento explícito.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-3">
            {platforms.map((platform) => (
              <article
                key={platform.name}
                className="glass-panel rounded-2xl border border-white/10 p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{platform.icon}</span>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{platform.name}</h3>
                      <p className="text-sm text-slate-400">v{platform.version}</p>
                    </div>
                  </div>
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                    {platform.status}
                  </span>
                </div>

                <div className="mt-6 flex items-center gap-4 text-sm text-slate-400">
                  <span>{platform.size}</span>
                  <span>•</span>
                  <span className="font-mono text-xs">{platform.hash.slice(0, 20)}...</span>
                </div>

                <a
                  href={platform.downloadUrl}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-cyan-400 to-emerald-400 px-6 py-4 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(6,182,212,0.25)]"
                >
                  <Download className="h-4.5 w-4.5" />
                  Descargar
                </a>

                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-white">Instrucciones</h4>
                  <ol className="mt-3 space-y-2">
                    {platform.instructions.map((instruction, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                        {instruction}
                      </li>
                    ))}
                  </ol>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-200">Instalación silenciosa</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              Despliegue masivo para escuelas y empresas.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-400">
              Comandos para instalación automatizada sin interacción del usuario. Ideal para MDM, scripts de despliegue y Plan Ceibal.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {silentInstallInstructions.map((instruction) => (
              <div key={instruction.title} className="glass-panel rounded-2xl border border-white/10 p-6">
                <div className="flex items-center gap-3">
                  <Terminal className="h-5 w-5 text-orange-200" />
                  <h3 className="text-lg font-semibold text-white">{instruction.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-400">{instruction.description}</p>
                <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/80 p-4">
                  <code className="text-xs font-mono text-slate-300">{instruction.command}</code>
                  <button className="ml-2 text-slate-500 hover:text-white" title="Copiar comando">
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">Verificación de integridad</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              Verificá que la descarga no fue modificada.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-400">
              Comprobá el hash SHA256 del archivo descargado contra el valor publicado para asegurar integridad y soberanía.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {verificationSteps.map((step) => (
              <div key={step.title} className="glass-panel rounded-2xl border border-white/10 p-6">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-200" />
                  <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                </div>
                <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/80 p-4">
                  <code className="text-xs font-mono text-slate-300">{step.command}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-slate-950 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="glass-panel rounded-[2rem] border border-white/10 bg-linear-to-r from-slate-900 to-slate-950 p-10">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                <Lock className="h-6 w-6 text-cyan-200" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-white">Soberanía garantizada</h2>
                <p className="mt-3 text-base leading-7 text-slate-400">
                  El Device Agent procesa todos los datos localmente en tu dispositivo. Solo se sincroniza con Supabase cuando vos lo autorizás explícitamente. Tus reglas, tus datos, tu control.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    'Procesamiento local',
                    'Encriptación de extremo a extremo',
                    'Sin telemetría invasiva',
                    'Código abierto disponible',
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-slate-200">
                      <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="glass-panel rounded-[2rem] border border-white/10 bg-linear-to-r from-slate-900 to-slate-950 p-10 text-center">
            <h2 className="text-2xl font-semibold text-white">¿Necesitás ayuda con la instalación?</h2>
            <p className="mt-3 text-base leading-7 text-slate-400">
              Consultá nuestra documentación o unite a Discord para soporte en tiempo real.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/resources/docs"
                className="inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-6 py-4 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
              >
                Ver documentación
                <ArrowRight className="h-4.5 w-4.5" />
              </Link>
              <a
                href="https://discord.gg/byebut"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Unirse a Discord
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
