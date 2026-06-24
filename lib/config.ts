/**
 * Environment configuration and validation
 * This module validates all required environment variables at startup using Zod
 */

import { z } from 'zod';

// ============================================================================
// Zod Schema for Environment Variables
// ============================================================================

const envSchema = z.object({
  // Supabase Configuration
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL').optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required').optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'Supabase service role key is required').optional(),
  SUPABASE_URL: z.string().url('Invalid Supabase URL').optional(),
  SUPABASE_PUBLISHABLE_KEY: z.string().min(1, 'Supabase publishable key is required').optional(),
  SUPABASE_SECRET_KEY: z.string().min(1, 'Supabase secret key is required').optional(),
  SUPABASE_JWKS_URL: z.string().url('Invalid Supabase JWKS URL').optional(),

  // Application Configuration
  NEXT_PUBLIC_APP_URL: z.string().url('Invalid app URL'),

  // Mercado Pago Configuration
  MERCADOPAGO_ACCESS_TOKEN: z.string().min(1, 'Mercado Pago access token is required'),
  MERCADOPAGO_WEBHOOK_SECRET: z.string().optional(),

  // Upstash Redis (Optional for rate limiting)
  UPSTASH_REDIS_REST_URL: z.string().url('Invalid Redis URL').optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),

  // Email Configuration (Resend)
  RESEND_API_KEY: z.string().min(1).optional(),

  // PostHog Analytics (Optional)
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(),

  // Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
}).superRefine((env, ctx) => {
  const hasLegacySupabase = Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY && env.SUPABASE_SERVICE_ROLE_KEY);
  const hasNewSupabase = Boolean(env.SUPABASE_URL && env.SUPABASE_PUBLISHABLE_KEY && env.SUPABASE_SECRET_KEY);

  if (!hasLegacySupabase && !hasNewSupabase) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Supabase configuration requires either the legacy NEXT_PUBLIC_SUPABASE_* / SUPABASE_SERVICE_ROLE_KEY variables or the new SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY / SUPABASE_SECRET_KEY variables.',
      path: ['SUPABASE_URL'],
    });
  }
});

type EnvVarConfig = z.infer<typeof envSchema>;

/**
 * Validate all required environment variables using Zod
 * Throws an error if any required variables are missing or invalid
 */
export function validateEnv(): EnvVarConfig {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.issues
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('\n  ');

      throw new Error(
        `Environment variable validation failed:\n  ${formattedErrors}`
      );
    }
    throw error;
  }
}

/**
 * Get all environment configuration with type safety
 * Validates and returns environment variables
 */
export function getConfig(): EnvVarConfig {
  return validateEnv();
}

/**
 * Get a specific environment variable with type safety
 */
export function getEnvVar<K extends keyof EnvVarConfig>(key: K): EnvVarConfig[K] {
  return validateEnv()[key];
}

/**
 * Check if we're running in development mode
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Check if we're running in production mode
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if auth bypass is enabled (for development/testing)
 */
export function isAuthBypassEnabled(): boolean {
  return (
    isDevelopment() ||
    (process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? '').includes('placeholder') ||
    process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true'
  );
}

// Validate environment variables on module load (server-side only)
if (typeof window === 'undefined') {
  try {
    validateEnv(); // Validate but don't cache yet
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Environment validation warning:', error);
    } else {
      throw error;
    }
  }
}
