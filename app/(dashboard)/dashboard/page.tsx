// app/(dashboard)/dashboard/page.tsx
'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function Dashboard() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();
        setSubscription(data);
      }
    };

    fetchSubscription();

    if (status === 'success') {
      console.log('✅ ¡Suscripción activada correctamente!');
      // TODO: show toast or modal welcoming the user
    }
  }, [status]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Bienvenido a ByeBut</h1>
      {subscription ? (
        <div className="bg-zinc-900 p-6 rounded-2xl">
          <p>Plan: <strong>{subscription.plan}</strong></p>
          <p>Estado: <span className="text-green-500">{subscription.status}</span></p>
          {/* Próximamente: Guard engine, dispositivos, Family Mode */}
        </div>
      ) : (
        <p>Cargando tu suscripción...</p>
      )}
    </div>
  );
}
