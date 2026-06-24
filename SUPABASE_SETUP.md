# 🚀 Guía de Configuración de Supabase para ByeBut

Esta guía te explica paso a paso cómo configurar Supabase para el proyecto ByeBut.

## 📋 Requisitos Previos

- Cuenta en [Supabase](https://supabase.com)
- Proyecto de Supabase creado
- CLI de Supabase instalado (opcional, pero recomendado)

## 🔧 Paso 1: Crear Proyecto en Supabase

1. **Ir a [supabase.com](https://supabase.com) e iniciar sesión**
2. **Crear nuevo proyecto:**
   - Click en "New Project"
   - Nombre: `byebut-production` (o el que prefieras)
   - Database Password: Generar una contraseña segura y guardarla
   - Region: Elegir la más cercana a tus usuarios
   - Click en "Create new project"
   - Esperar 2-5 minutos mientras se crea el proyecto

## 🔑 Paso 2: Obtener Credenciales

1. **Ir a Project Settings → API**
2. **Copiar las siguientes credenciales:**
   - `Project URL`: https://xxxxx.supabase.co
   - `anon public key`: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   - `service_role key`: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (GUARDAR ESTA, es muy importante)

## 📝 Paso 3: Configurar Variables de Entorno en el Proyecto

Crear archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**IMPORTANTE:**
- `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` son públicas (se exponen en el cliente)
- `SUPABASE_SERVICE_ROLE_KEY` es PRIVADA (solo usar en server-side, nunca en cliente)

## 🗄️ Paso 4: Aplicar Migraciones de Base de Datos

Las migraciones ya están aplicadas en tu proyecto actual. Si necesitas aplicarlas en un proyecto nuevo:

### Opción A: Usar Supabase Dashboard (SQL Editor)

1. Ir a SQL Editor en el dashboard de Supabase
2. Copiar y ejecutar cada migración en orden:

**Migración 1: Tablas core**
```sql
-- Las tablas ya existen en tu proyecto
-- Verifica que estén: devices, subscriptions, profiles, etc.
```

**Migración 2: Tablas de dashboards**
```sql
-- child_profiles, companies, departments, schools, classrooms, students
-- Ya aplicadas anteriormente
```

**Migración 3: Funciones de métricas**
```sql
-- get_device_activity_summary, get_user_activity_summary, get_top_apps_by_usage
-- Ya aplicadas anteriormente
```

### Opción B: Usar Supabase CLI

```bash
# Instalar CLI
npm install -g supabase

# Login
supabase login

# Link al proyecto
supabase link --project-ref your-project-ref

# Aplicar migraciones
supabase db push
```

## 🔒 Paso 5: Configurar Autenticación

### Habilitar Email Auth

1. Ir a Authentication → Providers
2. Habilitar "Email"
3. Configurar:
   - Confirm email: Opcional (para desarrollo, deshabilitar)
   - Secure email change: Habilitar

### Habilitar Leaked Password Protection

1. Ir a Authentication → Password Security
2. Habilitar "Leaked password protection"
3. Esto verifica contraseñas contra HaveIBeenPwned.org

## 🎨 Paso 6: Configurar Storage (Opcional)

Si necesitas almacenar avatares o archivos:

1. Ir a Storage
2. Crear bucket `avatars`
3. Configurar políticas RLS:
   - Público: SELECT
   - Autenticado: INSERT, UPDATE, DELETE (propio)

## 📊 Paso 7: Verificar Tablas y RLS

### Verificar tablas creadas

1. Ir a Database → Tables
2. Deberías ver:
   - `devices`
   - `subscriptions`
   - `profiles`
   - `child_profiles`
   - `companies`
   - `departments`
   - `schools`
   - `classrooms`
   - `students`
   - `activity_logs`
   - `usage_logs`
   - `parental_rules`
   - `error_logs`

### Verificar RLS Policies

1. Ir a Database → Tables → Seleccionar tabla → Policies
2. Verificar que cada tabla tenga políticas apropiadas

## 🧪 Paso 8: Probar Conexión

Crear archivo de prueba `test-supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testConnection() {
  try {
    const { data, error } = await supabase.from('profiles').select('*').limit(1)
    
    if (error) throw error
    
    console.log('✅ Conexión exitosa a Supabase')
    console.log('Datos:', data)
  } catch (error) {
    console.error('❌ Error de conexión:', error)
  }
}

testConnection()
```

Ejecutar:
```bash
node test-supabase.js
```

## 🤖 Paso 9: Configurar Agente de Dispositivo

1. Ir a `agent/` carpeta
2. Copiar `.env.example` a `.env`
3. Configurar:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   DEVICE_ID=obtener-del-dashboard
   USER_ID=obtener-del-dashboard
   ```

### Obtener DEVICE_ID

1. Registrar un dispositivo desde el dashboard web
2. Ir a Database → Tables → devices
3. Copiar el `id` del dispositivo

### Obtener USER_ID

1. Ir a Authentication → Users
2. Copiar el `id` del usuario

## 🔍 Paso 10: Verificar Advisors de Seguridad

1. Ir a Database → Advisor
2. Ejecutar advisor de seguridad
3. Deberías ver 0 advertencias críticas después de nuestras correcciones

## 🚨 Troubleshooting

### Error: "Invalid API key"
- Verifica que `NEXT_PUBLIC_SUPABASE_ANON_KEY` sea correcta
- Verifica que no haya espacios extra en el archivo `.env`

### Error: "Relation does not exist"
- Verifica que las migraciones se aplicaron correctamente
- Revisa el nombre de la tabla (case-sensitive)

### Error: "RLS policy violation"
- Verifica que las políticas RLS estén configuradas
- Verifica que el usuario esté autenticado

### Error: "Function not found"
- Verifica que las funciones se crearon en SQL Editor
- Revisa el nombre de la función (exactamente como está en la migración)

## 📚 Recursos Útiles

- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de Auth](https://supabase.com/docs/guides/auth)
- [Guía de Database](https://supabase.com/docs/guides/database)
- [Guía de RLS](https://supabase.com/docs/guides/auth/row-level-security)

## ✅ Checklist de Configuración

- [ ] Proyecto creado en Supabase
- [ ] Variables de entorno configuradas
- [ ] Migraciones aplicadas
- [ ] Autenticación configurada
- [ ] RLS policies verificadas
- [ ] Conexión probada
- [ ] Agente de dispositivo configurado
- [ ] Advisors de seguridad verificados
- [ ] Leaked password protection habilitado

## 🎯 Próximos Pasos

Una vez configurado Supabase:

1. **Iniciar el proyecto:**
   ```bash
   npm run dev
   ```

2. **Registrar un usuario de prueba**

3. **Crear un dispositivo de prueba**

4. **Ejecutar el agente en modo desarrollo**

5. **Verificar que los datos lleguen a Supabase en tiempo real**

---

¿Necesitas ayuda con algún paso específico de esta configuración?
