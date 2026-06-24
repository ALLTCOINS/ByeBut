# Guía de Configuración RLS para Supabase Storage

Los buckets ya están creados. Ahora necesitás configurar las políticas de seguridad desde el Dashboard de Supabase.

## Paso 1: Acceder al Dashboard de Storage

1. Andá a https://supabase.com/dashboard
2. Entrá a tu proyecto
3. Navegá a **Storage** en el menú lateral

## Paso 2: Configurar Bucket "avatars" (Público)

1. Clic en el bucket **avatars**
2. Andá a la pestaña **Policies**
3. Creá las siguientes políticas:

### Policy 1: Public can view avatars
- **Name**: Public can view avatars
- **Allowed operation**: SELECT
- **Target roles**: public (anon)
- **USING expression**: `bucket_id = 'avatars'`

### Policy 2: Authenticated can upload avatars
- **Name**: Authenticated can upload avatars
- **Allowed operation**: INSERT
- **Target roles**: authenticated
- **WITH CHECK expression**: `bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]`

### Policy 3: Users can update their own avatars
- **Name**: Users can update their own avatars
- **Allowed operation**: UPDATE
- **Target roles**: authenticated
- **USING expression**: `bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]`
- **WITH CHECK expression**: `bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]`

### Policy 4: Users can delete their own avatars
- **Name**: Users can delete their own avatars
- **Allowed operation**: DELETE
- **Target roles**: authenticated
- **USING expression**: `bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]`

## Paso 3: Configurar Bucket "reports" (Privado)

1. Clic en el bucket **reports**
2. Andá a la pestaña **Policies**
3. Creá las siguientes políticas:

### Policy 1: Users can view their own reports
- **Name**: Users can view their own reports
- **Allowed operation**: SELECT
- **Target roles**: authenticated
- **USING expression**: `bucket_id = 'reports' AND auth.uid()::text = (storage.foldername(name))[1]`

### Policy 2: Users can upload their own reports
- **Name**: Users can upload their own reports
- **Allowed operation**: INSERT
- **Target roles**: authenticated
- **WITH CHECK expression**: `bucket_id = 'reports' AND auth.uid()::text = (storage.foldername(name))[1]`

### Policy 3: Users can update their own reports
- **Name**: Users can update their own reports
- **Allowed operation**: UPDATE
- **Target roles**: authenticated
- **USING expression**: `bucket_id = 'reports' AND auth.uid()::text = (storage.foldername(name))[1]`
- **WITH CHECK expression**: `bucket_id = 'reports' AND auth.uid()::text = (storage.foldername(name))[1]`

### Policy 4: Users can delete their own reports
- **Name**: Users can delete their own reports
- **Allowed operation**: DELETE
- **Target roles**: authenticated
- **USING expression**: `bucket_id = 'reports' AND auth.uid()::text = (storage.foldername(name))[1]`

## Paso 4: Configurar Bucket "assets" (Público)

1. Clic en el bucket **assets**
2. Andá a la pestaña **Policies**
3. Creá las siguientes políticas:

### Policy 1: Public can view assets
- **Name**: Public can view assets
- **Allowed operation**: SELECT
- **Target roles**: public (anon)
- **USING expression**: `bucket_id = 'assets'`

### Policy 2: Service role can manage assets
- **Name**: Service role can manage assets
- **Allowed operation**: ALL
- **Target roles**: service_role
- **USING expression**: `bucket_id = 'assets'`
- **WITH CHECK expression**: `bucket_id = 'assets'`

## Notas Importantes

- `storage.foldername(name)` extrae la primera carpeta del path del archivo
- Los nombres de archivo se generan como `{userId}-{timestamp}.extension` para avatars
- Los nombres de archivo se generan como `{userId}/{reportType}/{timestamp}.extension` para reports
- Las signed URLs para el bucket `reports` expiran en 1 hora por defecto

## Verificación

Una vez configuradas, podés verificar las políticas:

1. En cada bucket, andá a la pestaña **Policies**
2. Deberías ver todas las políticas listadas con estado "Active"
3. Probá subir un archivo desde la app para verificar que funcione
