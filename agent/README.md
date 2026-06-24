# ByeBut Device Agent

Agente multiplataforma para monitoreo de dispositivos de ByeBut. Captura actividad de aplicaciones, tiempo de pantalla y envía datos a Supabase en tiempo real.

## 🚀 Instalación

### Requisitos
- Python 3.8+
- pip

### Pasos

1. **Clonar o copiar la carpeta `agent`**
   ```bash
   cd byebut/agent
   ```

2. **Instalar dependencias**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Editar `.env` con tus credenciales:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   DEVICE_ID=your-device-uuid-here
   USER_ID=your-user-uuid-here
   MONITORING_INTERVAL=60
   ```

## 🔑 Obtener IDs

### DEVICE_ID
El ID del dispositivo se crea al registrar el dispositivo desde el dashboard web. Puedes obtenerlo desde:
- Dashboard → Dispositivos → Ver detalles del dispositivo

### USER_ID
El ID del usuario se obtiene de la tabla `auth.users` en Supabase o desde el perfil del usuario en el dashboard.

## 📱 Uso

### Ejecución básica
```bash
python byebut_agent.py
```

### Ejecución con intervalo personalizado (segundos)
```bash
python byebut_agent.py 30  # Monitorea cada 30 segundos
```

### Ejecutar como servicio en segundo plano

**Linux (systemd):**
```bash
sudo cp byebut-agent.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable byebut-agent
sudo systemctl start byebut-agent
```

**macOS (launchd):**
```bash
cp com.byebut.agent.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.byebut.agent.plist
```

**Windows (Task Scheduler):**
1. Abrir Programador de tareas
2. Crear tarea básica
3. Ejecutar: `python C:\path\to\byebut_agent.py`
4. Configurar para iniciar al iniciar sesión

## 📊 Funcionalidades

### Monitoreo de Actividad
- **Apps abiertas**: Detecta cuando se abre una nueva aplicación
- **Apps cerradas**: Detecta cuando se cierra una aplicación
- **Tiempo de pantalla**: Registra minutos de uso acumulado
- **Violaciones de reglas**: Detecta cuando se exceden los límites de tiempo

### Reglas Parentales
El agente consulta periódicamente las reglas configuradas en Supabase:
- **Límites de tiempo**: Si se excede el tiempo permitido, registra una violación
- **Filtros de contenido**: (Futuro) Bloqueo de apps específicas

### Datos Enviados a Supabase
- `activity_logs`: Eventos de apertura/cierre de apps
- `usage_logs`: Tiempo acumulado de uso por día

## 🔒 Seguridad

- Las credenciales se almacenan en `.env` (no en código)
- Usa anon key de Supabase (no service role key)
- Los datos se envían vía HTTPS
- RLS policies en Supabase protegen el acceso

## 🛠️ Troubleshooting

### Error: Missing required environment variables
Verifica que el archivo `.env` exista y tenga todas las variables requeridas.

### Error: Failed to log activity
- Verifica que `SUPABASE_URL` y `SUPABASE_ANON_KEY` sean correctos
- Verifica que el dispositivo exista en la base de datos
- Revisa las RLS policies en Supabase

### El agente no detecta apps
- En Linux/macOS, puede requerir permisos elevados para ver todos los procesos
- En Windows, algunos procesos del sistema pueden estar protegidos

## 📝 Logs

El agente imprime logs en tiempo real:
- ✓ Indica operaciones exitosas
- ✗ Indica errores
- 📊 Indica estadísticas del monitoreo

## 🔄 Futuras Mejoras

- [ ] Bloqueo activo de apps (Windows/macOS/Linux)
- [ ] Integración con WebSockets para tiempo real
- [ ] Interfaz gráfica de configuración
- [ ] Modo silencioso (sin logs en consola)
- [ ] Exportación de reportes locales
- [ ] Detección de actividad de teclado/mouse para idle time
