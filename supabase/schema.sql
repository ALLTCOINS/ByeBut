-- Esqueleto de base de datos para ByeBut
-- Solución soberana de control parental y descentralizada

-- 0. Limpieza de tablas inconsistentes de trading (Modo demo previo)
DROP TABLE IF EXISTS public.coins CASCADE;
DROP TABLE IF EXISTS public.whale_clusters CASCADE;

-- 1. Perfiles de usuario
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Los usuarios pueden ver su propio perfil" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Los usuarios pueden actualizar su propio perfil" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 2. Suscripciones (Preparado para Mercado Pago)
DO $$ BEGIN
  CREATE TYPE public.subscription_status AS ENUM ('active', 'inactive', 'past_due', 'canceled', 'trialing');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.subscription_plan AS ENUM ('individual', 'familiar', 'institucional');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  plan public.subscription_plan NOT NULL DEFAULT 'individual',
  status public.subscription_status NOT NULL DEFAULT 'inactive',
  devices_allowed INTEGER NOT NULL DEFAULT 1,
  
  -- Campos específicos de Mercado Pago
  mercadopago_customer_id TEXT,
  mercadopago_subscription_id TEXT,
  mercadopago_payment_id TEXT,
  mp_preference_id TEXT,
  
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  cancel_reason TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id)
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Los usuarios pueden ver su propia suscripción" 
    ON public.subscriptions FOR SELECT 
    USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 3. Dispositivos bajo monitoreo
CREATE TABLE IF NOT EXISTS public.devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  device_type TEXT NOT NULL, -- mobile, tablet, desktop, other
  platform TEXT, -- ios, android, windows, mac, etc.
  identifier TEXT, -- dirección MAC, ID único, etc.
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  status TEXT DEFAULT 'active', -- active, paused, inactive
  
  -- Campos para segmentación escolar y corporativa (Descentralización / Soberanía)
  classroom_id TEXT,
  school_id TEXT,
  company_id TEXT,
  region TEXT,
  owner TEXT, -- Nombre del estudiante o empleado responsable
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;

CREATE SCHEMA IF NOT EXISTS internal;

CREATE OR REPLACE FUNCTION internal.has_role(role_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (auth.jwt() -> 'app_metadata' ->> 'role') = role_name;
END;
$$ LANGUAGE plpgsql STABLE;

DO $$ BEGIN
  CREATE POLICY "Usuarios/Admins pueden ver sus dispositivos" 
    ON public.devices FOR SELECT 
    USING (
      auth.uid() = user_id OR 
      internal.has_role('school_admin') OR
      internal.has_role('teacher') OR
      internal.has_role('enterprise_admin') OR
      internal.has_role('ceibal_admin')
    );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Usuarios/Admins pueden modificar sus dispositivos" 
    ON public.devices FOR ALL 
    USING (
      auth.uid() = user_id OR 
      internal.has_role('school_admin') OR
      internal.has_role('teacher') OR
      internal.has_role('enterprise_admin') OR
      internal.has_role('ceibal_admin')
    );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 4. Reglas parentales / de filtrado
CREATE TABLE IF NOT EXISTS public.parental_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID REFERENCES public.devices ON DELETE CASCADE NOT NULL,
  rule_type TEXT NOT NULL, -- time_limit, schedule, content_filter, app_block
  time_limit_minutes INTEGER,
  schedule_start TEXT, -- HH:MM
  schedule_end TEXT, -- HH:MM
  blocked_categories TEXT[],
  blocked_apps TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.parental_rules ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Usuarios/Admins pueden ver reglas" 
    ON public.parental_rules FOR SELECT 
    USING (
      EXISTS (
        SELECT 1 FROM public.devices d 
        WHERE d.id = device_id AND (
          d.user_id = auth.uid() OR 
          internal.has_role('school_admin') OR
          internal.has_role('teacher') OR
          internal.has_role('enterprise_admin') OR
          internal.has_role('ceibal_admin')
        )
      )
    );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Usuarios/Admins pueden gestionar reglas" 
    ON public.parental_rules FOR ALL 
    USING (
      EXISTS (
        SELECT 1 FROM public.devices d 
        WHERE d.id = device_id AND (
          d.user_id = auth.uid() OR 
          internal.has_role('school_admin') OR
          internal.has_role('teacher') OR
          internal.has_role('enterprise_admin') OR
          internal.has_role('ceibal_admin')
        )
      )
    );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 5. Perfiles de Hijos (Plan Familiar)
CREATE TABLE IF NOT EXISTS public.child_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  age INTEGER,
  avatar_url TEXT,
  birth_date TIMESTAMP WITH TIME ZONE,
  settings JSONB DEFAULT '{}'::JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.child_profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Padres pueden ver perfiles de hijos" 
    ON public.child_profiles FOR SELECT 
    USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Padres pueden gestionar perfiles de hijos" 
    ON public.child_profiles FOR ALL 
    USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 6. Logs de Actividad (Auditoría en tiempo real y foco)
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID REFERENCES public.devices ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL, -- app_open, app_close, screen_change, notification, other
  app_name TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Usuarios/Admins pueden ver logs" 
    ON public.activity_logs FOR SELECT 
    USING (
      EXISTS (
        SELECT 1 FROM public.devices d 
        WHERE d.id = device_id AND (
          d.user_id = auth.uid() OR 
          internal.has_role('school_admin') OR
          internal.has_role('teacher') OR
          internal.has_role('enterprise_admin') OR
          internal.has_role('ceibal_admin')
        )
      )
    );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Dispositivos/Admins pueden insertar logs" 
    ON public.activity_logs FOR INSERT 
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.devices d 
        WHERE d.id = device_id AND (
          d.user_id = auth.uid() OR 
          internal.has_role('school_admin') OR
          internal.has_role('teacher') OR
          internal.has_role('enterprise_admin') OR
          internal.has_role('ceibal_admin')
        )
      )
    );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 7. Historial de Uso y Tiempo de Pantalla
CREATE TABLE IF NOT EXISTS public.usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID REFERENCES public.devices ON DELETE CASCADE NOT NULL,
  session_start TIMESTAMP WITH TIME ZONE NOT NULL,
  session_end TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  app_name TEXT,
  app_category TEXT,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Usuarios/Admins pueden ver historial de uso" 
    ON public.usage_logs FOR SELECT 
    USING (
      EXISTS (
        SELECT 1 FROM public.devices d 
        WHERE d.id = device_id AND (
          d.user_id = auth.uid() OR 
          internal.has_role('school_admin') OR
          internal.has_role('teacher') OR
          internal.has_role('enterprise_admin') OR
          internal.has_role('ceibal_admin')
        )
      )
    );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 8. Cola de Webhooks de Mercado Pago (para reintentos y estabilidad)
CREATE TABLE IF NOT EXISTS public.webhook_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'processing', -- processing, completed, failed
  attempts INTEGER DEFAULT 1,
  error_message TEXT,
  next_retry_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.webhook_queue ENABLE ROW LEVEL SECURITY;
-- No definimos políticas públicas para webhook_queue, bloqueando todo acceso anon/autenticado.
-- Solo el rol de servicio (Service Role / Admin) podrá acceder e insertar en esta tabla.

-- 9. Registro de eventos financieros / refunds para auditoría
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  payment_id TEXT,
  subscription_id UUID REFERENCES public.subscriptions ON DELETE SET NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Solo service role puede ver eventos webhook"
    ON public.webhook_events FOR SELECT
    USING (false);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Triggers para perfiles automáticos al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  -- Crear una suscripción inicial inactiva
  INSERT INTO public.subscriptions (user_id, status)
  VALUES (NEW.id, 'inactive')
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Revocar privilegios de ejecución para evitar llamadas RPC maliciosas
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, service_role;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Funciones auxiliares de utilidad para roles (en esquema interno privado)
DROP FUNCTION IF EXISTS public.is_admin();
CREATE SCHEMA IF NOT EXISTS internal;

CREATE OR REPLACE FUNCTION internal.is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (auth.jwt() ->> 'email') LIKE '%@byebut.com' OR internal.has_role('admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Permitimos ejecución para RLS interno pero no se expone vía RPC porque no está en el esquema public
GRANT EXECUTE ON FUNCTION internal.is_admin() TO public, anon, authenticated;
