import SignupPanel from '@/components/SignupPanel';

export default function RegisterPage() {
  return (
    <section className="min-h-screen px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">Registro</p>
          <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
            Crear cuenta con el mismo pulso visual de ByeBut.
          </h1>
          <p className="mt-5 text-base leading-8 text-slate-300">
            Si preferís registrarte en una página dedicada, esta vista conserva la misma estética y el mismo relato que la landing.
          </p>
        </div>
        <SignupPanel />
      </div>
    </section>
  );
}
