import supabase from '@/lib/supabase/client';

// Validaciones de archivo
const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_REPORT_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_ASSET_SIZE = 50 * 1024 * 1024; // 50MB

const ALLOWED_AVATAR_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
const ALLOWED_REPORT_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];
const ALLOWED_ASSET_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'application/pdf'];

interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

/**
 * Sube un avatar de usuario al bucket público
 * @param userId - ID del usuario
 * @param file - Archivo a subir
 * @returns URL pública del avatar
 */
export async function uploadAvatar(userId: string, file: File): Promise<UploadResult> {
  try {
    // Validar tamaño
    if (file.size > MAX_AVATAR_SIZE) {
      return { success: false, error: 'El archivo excede el tamaño máximo de 2MB' };
    }

    // Validar tipo
    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      return { success: false, error: 'Tipo de archivo no permitido. Solo PNG, JPEG, WebP y GIF' };
    }

    // Generar nombre único
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const fileName = `${userId}-${timestamp}.${extension}`;

    // Subir archivo
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    // Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(data.path);

    return { success: true, url: publicUrl, path: data.path };
  } catch (error) {
    return { success: false, error: 'Error al subir el avatar' };
  }
}

/**
 * Sube un reporte al bucket privado
 * @param userId - ID del usuario
 * @param file - Archivo a subir
 * @param reportType - Tipo de reporte (usage, focus, screenshot, etc.)
 * @returns Signed URL válida por 1 hora
 */
export async function uploadReport(userId: string, file: File, reportType: string = 'usage'): Promise<UploadResult> {
  try {
    // Validar tamaño
    if (file.size > MAX_REPORT_SIZE) {
      return { success: false, error: 'El archivo excede el tamaño máximo de 10MB' };
    }

    // Validar tipo
    if (!ALLOWED_REPORT_TYPES.includes(file.type)) {
      return { success: false, error: 'Tipo de archivo no permitido. Solo PDF, PNG, JPEG y WebP' };
    }

    // Generar nombre único con estructura de carpetas
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const fileName = `${userId}/${reportType}/${timestamp}.${extension}`;

    // Subir archivo
    const { data, error } = await supabase.storage
      .from('reports')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    // Generar signed URL válida por 1 hora
    const { data: signedUrl, error: signedError } = await supabase.storage
      .from('reports')
      .createSignedUrl(data.path, 60 * 60);

    if (signedError) {
      return { success: false, error: signedError.message };
    }

    return { success: true, url: signedUrl.signedUrl, path: data.path };
  } catch (error) {
    return { success: false, error: 'Error al subir el reporte' };
  }
}

/**
 * Obtiene una signed URL para un reporte existente
 * @param path - Ruta del archivo en el bucket
 * @param expiresIn - Tiempo de expiración en segundos (default: 1 hora)
 */
export async function getReportSignedUrl(path: string, expiresIn: number = 3600): Promise<UploadResult> {
  try {
    const { data, error } = await supabase.storage
      .from('reports')
      .createSignedUrl(path, expiresIn);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, url: data.signedUrl, path };
  } catch (error) {
    return { success: false, error: 'Error al generar la URL firmada' };
  }
}

/**
 * Lista todos los reportes de un usuario
 * @param userId - ID del usuario
 */
export async function listUserReports(userId: string): Promise<UploadResult> {
  try {
    const { data, error } = await supabase.storage
      .from('reports')
      .list(userId, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) {
      return { success: false, error: error.message };
    }

    // Generar signed URLs para cada archivo
    const filesWithUrls = await Promise.all(
      data.map(async (file) => {
        const { data: signedUrl } = await supabase.storage
          .from('reports')
          .createSignedUrl(`${userId}/${file.name}`, 3600);
        return {
          ...file,
          signedUrl: signedUrl?.signedUrl || null,
        };
      })
    );

    return { success: true, url: JSON.stringify(filesWithUrls) };
  } catch (error) {
    return { success: false, error: 'Error al listar reportes' };
  }
}

/**
 * Elimina un avatar
 * @param path - Ruta del archivo
 */
export async function deleteAvatar(path: string): Promise<UploadResult> {
  try {
    const { error } = await supabase.storage
      .from('avatars')
      .remove([path]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error al eliminar el avatar' };
  }
}

/**
 * Elimina un reporte
 * @param path - Ruta del archivo
 */
export async function deleteReport(path: string): Promise<UploadResult> {
  try {
    const { error } = await supabase.storage
      .from('reports')
      .remove([path]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error al eliminar el reporte' };
  }
}
