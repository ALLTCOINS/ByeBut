/**
 * Zod validation schemas for API routes and forms
 * Provides type-safe input validation across the application
 */

import { z } from 'zod';

// ============================================================================
// Device Validation Schemas
// ============================================================================

export const deviceSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Device name is required').max(100, 'Device name too long'),
  device_type: z.enum(['mobile', 'tablet', 'desktop', 'other']),
  platform: z.string().max(50).optional(),
  identifier: z.string().max(100).optional(),
  is_active: z.boolean().default(true),
  status: z.enum(['active', 'paused', 'inactive']).optional(),
});

export const deviceUpdateSchema = deviceSchema.partial().extend({
  id: z.string().uuid('Invalid device ID'),
});

// ============================================================================
// Parental Rules Validation Schemas
// ============================================================================

export const ruleSchema = z.object({
  id: z.string().uuid().optional(),
  device_id: z.string().uuid('Invalid device ID'),
  rule_type: z.enum(['time_limit', 'schedule', 'content_filter', 'app_block']),
  time_limit_minutes: z.number().min(1).max(1440).optional(),
  schedule_start: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)').optional(),
  schedule_end: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)').optional(),
  blocked_categories: z.array(z.string().max(50)).optional(),
  blocked_apps: z.array(z.string().max(100)).optional(),
  is_active: z.boolean().default(true),
});

export const ruleUpdateSchema = ruleSchema.partial().extend({
  id: z.string().uuid('Invalid rule ID'),
});

// ============================================================================
// Subscription Validation Schemas
// ============================================================================

export const subscriptionSchema = z.object({
  id: z.string().uuid().optional(),
  plan: z.enum(['individual', 'familiar', 'institucional']),
  status: z.enum(['active', 'trialing', 'past_due', 'canceled', 'incomplete']).optional(),
  mercadopago_payment_id: z.string().optional(),
  mercadopago_preference_id: z.string().optional(),
});

export const subscriptionCancelSchema = z.object({
  reason: z.string().max(500).optional(),
  feedback: z.string().max(1000).optional(),
});

// ============================================================================
// Child Profile Validation Schemas
// ============================================================================

export const childProfileSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
  age: z.number().min(0).max(18, 'Age must be between 0 and 18'),
  avatar_url: z.string().url('Invalid avatar URL').optional().nullable(),
  birth_date: z.string().datetime().optional(),
  settings: z.record(z.string(), z.unknown()).optional(),
});

export const childProfileUpdateSchema = childProfileSchema.partial().extend({
  id: z.string().uuid('Invalid child profile ID'),
});

export const childProfileCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
  birth_year: z.number().int().min(2000, 'Birth year must be 2000 or later').max(new Date().getFullYear(), 'Birth year cannot be in the future').optional(),
  avatar_emoji: z.string().max(4, 'Avatar emoji too long').optional(),
});

// ============================================================================
// Usage Log Validation Schemas
// ============================================================================

export const usageLogSchema = z.object({
  device_id: z.string().uuid('Invalid device ID'),
  session_start: z.string().datetime('Invalid session start time'),
  session_end: z.string().datetime('Invalid session end time').optional(),
  duration_minutes: z.number().min(0).optional(),
  app_name: z.string().max(100).optional(),
  app_category: z.string().max(50).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const usageLogEndSchema = z.object({
  id: z.string().uuid('Invalid usage log ID'),
  session_end: z.string().datetime('Invalid session end time'),
  duration_minutes: z.number().min(0, 'Duration must be positive'),
});

// ============================================================================
// Activity Log Validation Schemas
// ============================================================================

export const activityLogSchema = z.object({
  device_id: z.string().uuid('Invalid device ID'),
  activity_type: z.enum(['app_open', 'app_close', 'screen_change', 'notification', 'other']),
  app_name: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

// ============================================================================
// Mercado Pago Validation Schemas
// ============================================================================

export const mercadoPagoPreferenceSchema = z.object({
  plan: z.enum(['individual', 'familiar', 'institucional']),
});

export const createSubscriptionSchema = z.object({
  plan: z.enum(['individual', 'familiar', 'institucional']),
});

export const deviceRemoteControlSchema = z.object({
  device_id: z.string().uuid('Invalid device ID'),
  action: z.enum(['pause_device', 'resume_device']),
});

export const mercadoPagoWebhookSchema = z.object({
  id: z.string(),
  action: z.string(),
  data: z.object({
    id: z.string(),
  }),
  date_created: z.string().optional(),
  type: z.string().optional(),
});

// ============================================================================
// Email Validation Schemas
// ============================================================================

export const emailSendSchema = z.object({
  to: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required').max(200),
  html: z.string().min(1, 'HTML content is required'),
  text: z.string().optional(),
});

export const emailTriggerSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('welcome'),
    to: z.string().email('Invalid email address'),
    name: z.string().min(1, 'Name is required')
  }),
  z.object({
    type: z.literal('trial_expiring'),
    to: z.string().email('Invalid email address'),
    name: z.string().min(1, 'Name is required'),
    daysLeft: z.number().int().min(1, 'Days left must be at least 1')
  }),
]);

// ============================================================================
// Auth Validation Schemas
// ============================================================================

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
  full_name: z.string().min(1, 'Full name is required').max(100),
});

export const magicLinkSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// ============================================================================
// Age Preset Validation Schemas
// ============================================================================

export const agePresetSchema = z.object({
  age: z.number().min(0).max(18),
  name: z.string().min(1).max(50),
  description: z.string().max(500).optional(),
  rules: z.array(ruleSchema),
});

// ============================================================================
// Class Mode Validation Schemas
// ============================================================================

export const classModeSchema = z.object({
  enabled: z.boolean(),
  schedule_start: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
  schedule_end: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
  days: z.array(z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])),
  allowed_apps: z.array(z.string()).optional(),
  blocked_apps: z.array(z.string()).optional(),
});

export const classModeToggleSchema = z.object({
  device_ids: z.array(z.string().uuid('Invalid device ID')).min(1, 'At least one device ID required').max(50, 'Maximum 50 devices'),
  allowed_url: z.string().url('Invalid URL').nullable().optional(),
  mode: z.enum(['clase', 'examen', 'tarea', 'off']),
});

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Validate data against a schema and return formatted error response
 */
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string; details: Array<{ field: string; message: string }> | null } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Validation failed',
        details: error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      };
    }
    return {
      success: false,
      error: 'Unknown validation error',
      details: null,
    };
  }
}

/**
 * Middleware function to validate API requests
 */
export function withValidation<T>(
  schema: z.ZodSchema<T>,
  handler: (data: T, request: Request) => Promise<Response>
) {
  return async (request: Request) => {
    try {
      const body = await request.json();
      const validation = validateRequest(schema, body);

      if (!validation.success) {
        return Response.json(
          { error: validation.error, details: validation.details },
          { status: 400 }
        );
      }

      return await handler(validation.data, request);
    } catch (error) {
      return Response.json(
        { error: 'Invalid JSON in request body', details: error instanceof Error ? error.message : 'Unknown error' },
        { status: 400 }
      );
    }
  };
}
