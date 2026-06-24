/**
 * ByeBut Email Service — powered by Resend
 * Centralised email dispatching for all transactional messages.
 *
 * Required env var: RESEND_API_KEY
 * Recommended: configure a sending domain in resend.com/domains (e.g. @byebut.com)
 */

import { Resend } from 'resend';

// Lazy-initialise so the module doesn't explode during build if key is absent
let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    _resend = new Resend(key);
  }
  return _resend;
}

// ─── Shared config ────────────────────────────────────────────────────────────

const FROM_DEFAULT = process.env.RESEND_FROM_EMAIL || 'ByeBut <hola@byebut.com>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://byebut.com';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SendResult {
  id: string;
  error?: string;
}

export interface WelcomeEmailPayload {
  to: string;
  userName: string;
  avatarId?: string;
  /** Cosmic alias the user chose during onboarding */
  cosmicName?: string;
}

export interface PaymentSuccessEmailPayload {
  to: string;
  userName: string;
  plan: 'individual' | 'familiar' | 'institucional';
  amount: number;
  currency?: string;
  nextBillingDate?: string;
}

export interface MissionCompletedEmailPayload {
  to: string;
  parentName: string;
  childName: string;
  missionTitle: string;
  tokensEarned: number;
}

export interface DeviceAlertEmailPayload {
  to: string;
  parentName: string;
  deviceName: string;
  action: 'paused' | 'resumed';
}

// ─── Plan metadata ────────────────────────────────────────────────────────────

const PLAN_LABELS: Record<string, { label: string; emoji: string }> = {
  individual: { label: 'Individual', emoji: '👤' },
  familiar:   { label: 'Familiar',   emoji: '👨‍👩‍👧‍👦' },
  institucional: { label: 'Institucional', emoji: '🏫' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Wraps a dark, space-themed HTML wrapper around email content */
function layout(title: string, body: string): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #0a0f1e; font-family: 'Segoe UI', Arial, sans-serif; color: #e2e8f0; }
    .container { max-width: 560px; margin: 0 auto; padding: 40px 24px; }
    .card { background: linear-gradient(135deg, #0f172a, #1e293b); border: 1px solid rgba(99,102,241,.3); border-radius: 16px; padding: 32px; }
    .logo { text-align: center; margin-bottom: 24px; }
    .logo-badge { display: inline-flex; align-items: center; gap: 10px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 12px; padding: 10px 20px; }
    .logo-text { font-size: 22px; font-weight: 800; color: #fff; letter-spacing: -0.5px; }
    .logo-sub { font-size: 11px; color: rgba(255,255,255,.6); text-transform: uppercase; letter-spacing: 1.5px; }
    h1 { font-size: 24px; font-weight: 700; color: #f8fafc; margin: 0 0 8px; }
    p { font-size: 15px; line-height: 1.6; color: #94a3b8; margin: 0 0 16px; }
    .highlight { color: #a5b4fc; font-weight: 600; }
    .btn { display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff !important; font-weight: 700; font-size: 15px; padding: 14px 28px; border-radius: 10px; text-decoration: none; margin: 8px 0; }
    .pill { display: inline-block; background: rgba(99,102,241,.15); border: 1px solid rgba(99,102,241,.3); border-radius: 20px; padding: 4px 14px; font-size: 13px; color: #a5b4fc; font-weight: 600; }
    .divider { height: 1px; background: rgba(255,255,255,.07); margin: 24px 0; }
    .footer { text-align: center; margin-top: 24px; font-size: 12px; color: rgba(148,163,184,.5); }
    .token-badge { background: linear-gradient(135deg, #f97316, #fb923c); border-radius: 8px; padding: 16px; text-align: center; margin: 16px 0; }
    .token-badge .amount { font-size: 36px; font-weight: 900; color: #fff; }
    .token-badge .label { font-size: 13px; color: rgba(255,255,255,.7); }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo">
        <div class="logo-badge">
          <span style="font-size:20px">🛸</span>
          <div>
            <div class="logo-text">ByeBut</div>
            <div class="logo-sub">Control Soberano</div>
          </div>
        </div>
      </div>
      ${body}
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} ByeBut — Soberanía Digital Familiar<br/>
      <a href="${APP_URL}/dashboard" style="color:rgba(165,180,252,.5);text-decoration:none;">Acceder al Dashboard</a>
    </div>
  </div>
</body>
</html>`;
}

// ─── Email Senders ────────────────────────────────────────────────────────────

/**
 * Welcome email sent immediately after successful registration.
 * Includes the user's alien avatar emoji and cosmic name if provided.
 */
export async function sendWelcomeEmail(payload: WelcomeEmailPayload): Promise<SendResult> {
  const { to, userName, cosmicName } = payload;
  const displayName = cosmicName || userName;

  const html = layout('Bienvenido a ByeBut 🛸', `
    <h1>¡Bienvenido a la misión, ${displayName}! 🌌</h1>
    <p>Tu familia acaba de unirse a la red de <span class="highlight">soberanía digital</span> más avanzada de Latinoamérica.</p>
    <p>Con ByeBut podrás:</p>
    <ul style="color:#94a3b8;padding-left:20px;line-height:2">
      <li>🛡️ Monitorear dispositivos en tiempo real</li>
      <li>⚡ Asignar misiones galácticas y recompensar el foco</li>
      <li>🔒 Aplicar reglas de uso sin depender de servidores externos</li>
    </ul>
    <div class="divider"></div>
    <p style="text-align:center">
      <a href="${APP_URL}/dashboard" class="btn">Explorar mi Dashboard →</a>
    </p>
    <p style="font-size:13px;color:rgba(148,163,184,.6);text-align:center">
      Tus datos son tuyos. Siempre.
    </p>
  `);

  try {
    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from: FROM_DEFAULT,
      to,
      subject: `¡Bienvenido a ByeBut, ${displayName}! 🛸`,
      html,
    });
    if (error) throw new Error(error.message);
    return { id: data?.id || 'ok' };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown email error';
    console.error('[email] sendWelcomeEmail error:', message);
    return { id: '', error: message };
  }
}

/**
 * Payment success / invoice email.
 * Sent after Mercado Pago confirms an approved payment.
 */
export async function sendPaymentSuccessEmail(payload: PaymentSuccessEmailPayload): Promise<SendResult> {
  const { to, userName, plan, amount, currency = 'USD', nextBillingDate } = payload;
  const planMeta = PLAN_LABELS[plan] ?? { label: plan, emoji: '✨' };

  const html = layout('Pago confirmado ✅', `
    <h1>Pago confirmado ✅</h1>
    <p>Hola <span class="highlight">${userName}</span>, tu suscripción está activa y tu familia está protegida.</p>
    <div style="background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.25);border-radius:12px;padding:20px;margin:16px 0;">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
        <div>
          <div style="font-size:13px;color:#94a3b8">Plan activo</div>
          <div style="font-size:20px;font-weight:800;color:#f8fafc">${planMeta.emoji} Plan ${planMeta.label}</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:13px;color:#94a3b8">Monto</div>
          <div style="font-size:20px;font-weight:800;color:#34d399">${currency} ${amount}/mes</div>
        </div>
      </div>
      ${nextBillingDate ? `<div class="divider"></div><div style="font-size:13px;color:#94a3b8;">Próxima renovación: <span style="color:#a5b4fc;font-weight:600">${nextBillingDate}</span></div>` : ''}
    </div>
    <div class="divider"></div>
    <p style="text-align:center">
      <a href="${APP_URL}/dashboard" class="btn">Ir a mi Dashboard →</a>
    </p>
  `);

  try {
    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from: FROM_DEFAULT,
      to,
      subject: `Pago confirmado — Plan ${planMeta.label} activo 🛸`,
      html,
    });
    if (error) throw new Error(error.message);
    return { id: data?.id || 'ok' };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown email error';
    console.error('[email] sendPaymentSuccessEmail error:', message);
    return { id: '', error: message };
  }
}

/**
 * Galactic Mission completed alert for parents.
 * Triggered when a child earns GuardTokens for completing a mission.
 */
export async function sendMissionCompletedEmail(payload: MissionCompletedEmailPayload): Promise<SendResult> {
  const { to, parentName, childName, missionTitle, tokensEarned } = payload;

  const html = layout('¡Misión completada! ⚡', `
    <h1>⚡ ¡Misión completada!</h1>
    <p>Hola <span class="highlight">${parentName}</span>, tenemos una gran noticia:</p>
    <p><strong style="color:#f8fafc">${childName}</strong> acaba de completar la misión galáctica:</p>
    <div style="background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.25);border-radius:12px;padding:16px;margin:16px 0;text-align:center;">
      <div style="font-size:16px;font-weight:700;color:#fbbf24">🎯 "${missionTitle}"</div>
    </div>
    <div class="token-badge">
      <div class="amount">+${tokensEarned}</div>
      <div class="label">✦ GuardTokens ganados</div>
    </div>
    <p style="font-size:13px;text-align:center;color:#94a3b8">
      Acumula GuardTokens para desbloquear Reliquias del Cosmos y evolucionar los avatares alienígenas.
    </p>
    <div class="divider"></div>
    <p style="text-align:center">
      <a href="${APP_URL}/dashboard" class="btn">Ver la Bóveda Estelar →</a>
    </p>
  `);

  try {
    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from: FROM_DEFAULT,
      to,
      subject: `⚡ ${childName} completó una misión galáctica (+${tokensEarned} GT)`,
      html,
    });
    if (error) throw new Error(error.message);
    return { id: data?.id || 'ok' };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown email error';
    console.error('[email] sendMissionCompletedEmail error:', message);
    return { id: '', error: message };
  }
}

/**
 * Device control alert — notifies parent when a device is paused or resumed.
 */
export async function sendDeviceAlertEmail(payload: DeviceAlertEmailPayload): Promise<SendResult> {
  const { to, parentName, deviceName, action } = payload;
  const isPaused = action === 'paused';
  const actionLabel = isPaused ? 'pausado' : 'reanudado';
  const actionColor = isPaused ? '#f59e0b' : '#10b981';
  const actionEmoji = isPaused ? '⏸️' : '▶️';

  const html = layout(`Dispositivo ${actionLabel} ${actionEmoji}`, `
    <h1>${actionEmoji} Dispositivo ${actionLabel}</h1>
    <p>Hola <span class="highlight">${parentName}</span>,</p>
    <p>El dispositivo <strong style="color:#f8fafc">${deviceName}</strong> ha sido <span style="color:${actionColor};font-weight:700">${actionLabel}</span> exitosamente desde tu dashboard.</p>
    <div style="background:rgba(15,23,42,.5);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:16px;margin:16px 0;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="color:#94a3b8;font-size:14px;">Dispositivo</span>
        <span style="color:#f8fafc;font-weight:600">${deviceName}</span>
      </div>
      <div class="divider"></div>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="color:#94a3b8;font-size:14px;">Estado</span>
        <span style="color:${actionColor};font-weight:700">${isPaused ? '⏸ Pausado' : '▶ Activo'}</span>
      </div>
    </div>
    <p style="font-size:13px;color:#94a3b8">Si no reconoces esta acción, revisa tu cuenta inmediatamente.</p>
    <div class="divider"></div>
    <p style="text-align:center">
      <a href="${APP_URL}/dashboard" class="btn">Gestionar dispositivos →</a>
    </p>
  `);

  try {
    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from: FROM_DEFAULT,
      to,
      subject: `${actionEmoji} Dispositivo "${deviceName}" ${actionLabel} — ByeBut`,
      html,
    });
    if (error) throw new Error(error.message);
    return { id: data?.id || 'ok' };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown email error';
    console.error('[email] sendDeviceAlertEmail error:', message);
    return { id: '', error: message };
  }
}
