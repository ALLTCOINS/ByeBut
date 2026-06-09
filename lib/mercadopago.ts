import { MercadoPagoConfig, PreApproval } from 'mercadopago';

/**
 * Cliente configurado de Mercado Pago
 * Asegúrate de tener MERCADOPAGO_ACCESS_TOKEN en tus variables de entorno.
 */
export const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
  options: { timeout: 5000 }
});

// Instancia para manejar suscripciones (PreApproval en MP)
export const subscriptionClient = new PreApproval(mpClient);
