# 🗺️ Guía de Arquitectura de Dashboards: ByeBut Soberano y Descentralizado

Este documento describe la estrategia de diseño y la estructura recomendada para escalar la plataforma **ByeBut** a sus tres públicos objetivos principales (**Familiar**, **Escuelas** y **Empresas**), junto con el soporte para **Plan Ceibal**, manteniendo su principio fundamental: **soberanía de datos, funcionamiento local/descentralizado y sin dependencia de nubes corporativas**.

---

## 1. 🔍 Filosofía de Descentralización: Soberanía de Datos

El objetivo de ByeBut es reemplazar soluciones centralizadas por un esquema donde:

1. **Los Agentes son Locales**: El software en el dispositivo se comunica directamente con la base de datos local (P2P o red local), sin enviar telemetría a servidores de terceros.
2. **Infraestructura Autohospedable / P2P**: Las empresas, escuelas u organizaciones pueden alojar su propia base de datos (por ejemplo, una instancia local de Supabase/PostgreSQL o syncing local) garantizando que los datos sensibles nunca salgan de su control físico.

---

## 2. 🏗️ Estructura del Código: Dashboards Específicos por Rol

Para evitar el desorden, cada público tiene su propia ruta y experiencia visual, pero reutilizan los mismos componentes visuales desde `/components`.

### Estructura de Carpetas en Next.js (Directorio `app/`):

```
byebut/
├── app/
│   ├── (dashboard)/
│   │   ├── dashboard/           # 🏠 Dashboard FAMILIAR (Padres e Hijos)
│   │   │   └── page.tsx
│   │   ├── school/              # 🏫 Dashboard ESCUELAS / COLEGIOS (Docentes y Directores)
│   │   │   └── page.tsx
│   │   ├── enterprise/          # 🏢 Dashboard EMPRESAS (Empleados y Seguridad IT)
│   │   │   └── page.tsx
│   │   └── ceibal/              # 🇺🇾 Dashboard PLAN CEIBAL (Administración masiva estatal)
│   │       └── page.tsx
│   ├── api/
│   │   ├── devices/             # API común para registro de dispositivos
│   │   ├── rules/               # API común para aplicación de políticas locales
│   │   └── ...
```

---

## 🧩 Reutilización de Código

Los bloques de construcción visuales se guardan en la carpeta `/components` y se adaptan a cada dashboard mediante propiedades (*props*).

### Ejemplo de Tabla de Dispositivos (`DeviceLiveTable.tsx`)

Un padre, un maestro de escuela, un administrador corporativo y un supervisor estatal de Ceibal ven la misma tabla pero filtrada por su caso de uso:

```typescript
// components/DeviceLiveTable.tsx
interface DeviceTableProps {
  viewMode: 'family' | 'school' | 'enterprise' | 'ceibal';
  filterId?: string; // ID de clase, organización o departamento
}
```

---

## 📊 Comparativa de Dashboards por Caso de Uso

| Dashboard | Ruta | Público Objetivo | Métricas Clave | Características Especiales |
| :--- | :--- | :--- | :--- | :--- |
| **Familiar** | `/dashboard` | Padres y tutores | Tiempo en pantalla por hijo, balance de uso diario. | Gamificación (GuardTokens), perfiles de hijos, advertencias de ocio. |
| **Escuelas** | `/school` | Maestros y Directores | Dispositivos en clase activos, atención colectiva, cumplimiento áulico. | Modo Clase/Examen temporal, bloqueo de apps específicas en horario lectivo. |
| **Empresas** | `/enterprise` | Administradores de IT / Seguridad | Conectividad local, niveles de parches de seguridad, uso de red corporativa. | Gestión por Departamentos, auditoría forense local de logs, sin telemetría externa. |
| **Plan Ceibal** | `/ceibal` | Administradores estatales de Ceibal | Compliance global por zona escolar, distribución masiva, parches de firmware. | Multi-escuelas, importación masiva de alumnos (bulk), reportes estatales de uso. |

---

## 🔄 Flujo de Redirección Inteligente

El sistema redirige automáticamente al iniciar sesión basándose en los metadatos de su perfil:

```typescript
const role = session.user?.app_metadata?.role || 'parent';

if (role === 'ceibal_admin') {
  return NextResponse.redirect('/ceibal');
} else if (role === 'school_admin' || role === 'teacher') {
  return NextResponse.redirect('/school');
} else if (role === 'enterprise_admin') {
  return NextResponse.redirect('/enterprise');
} else {
  return NextResponse.redirect('/dashboard'); // Familiar
}
```
