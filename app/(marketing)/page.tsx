/* app/(marketing)/page.tsx */
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-slate-800 px-4 text-center">
      {/* Hero illustration – replace with your own asset */}
      <Image
        src="/hero.svg"
        alt="Control parental soberano"
        width={320}
        height={320}
        className="mb-12"
      />

      {/* Title – strong and simple */}
      <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-white mb-6">
        Control parental <span className="text-cyan-500">sin ceder datos</span>
      </h1>

      {/* Subtitle – clear value proposition */}
      <p className="max-w-2xl mx-auto text-lg lg:text-xl text-slate-300 mb-10 leading-relaxed">
        ByeBut protege a tus hijos con una solución local‑first que vive en tus dispositivos.
        No enviamos información a Google, Facebook ni a ningún otro tercero; el control y la
        privacidad están 100 % bajo tu mando.
      </p>

      {/* Call‑to‑action buttons */}
      <div className="flex gap-4">
        <Link
          href="/precios"
          className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-cyan-900/30"
        >
          Ver planes
        </Link>
        <Link
          href="/demo"
          className="px-8 py-4 border border-cyan-600 text-cyan-600 font-medium rounded-lg hover:bg-cyan-600 hover:text-white transition-all"
        >
          Demo
        </Link>
      </div>

      <footer className="mt-12 text-sm text-slate-500">
        © {new Date().getFullYear()} ByeBut – Soberanía digital para Latinoamérica.
      </footer>
    </section>
  );
}
