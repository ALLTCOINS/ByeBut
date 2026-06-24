// lib/mercado-pago/server.ts
import { MercadoPagoConfig } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN || '',
});

export default client;
