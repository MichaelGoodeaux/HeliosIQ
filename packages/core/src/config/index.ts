// packages/core/src/config/index.ts

import { z } from 'zod';
import { config as sharedConfig } from '@heliosiq/shared';

const envSchema = z.object({
  // Monitoring Configuration
  PROMETHEUS_URL: z.string().url(),
  GRAFANA_URL: z.string().url(),
  ALERTMANAGER_URL: z.string().url(),

  // Security Configuration
  API_KEY: z.string().min(32),
  ENCRYPTION_KEY: z.string().min(32),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().regex(/^\d+$/),
  RATE_LIMIT_MAX_REQUESTS: z.string().regex(/^\d+$/),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error('❌ Required environment variables are missing:', JSON.stringify(env.error.format(), null, 2));
  process.exit(1);
}

export const config = {
  ...sharedConfig,
  monitoring: {
    prometheusUrl: env.data.PROMETHEUS_URL,
    grafanaUrl: env.data.GRAFANA_URL,
    alertmanagerUrl: env.data.ALERTMANAGER_URL,
  },
  security: {
    apiKey: env.data.API_KEY,
    encryptionKey: env.data.ENCRYPTION_KEY,
  },
  rateLimit: {
    windowMs: parseInt(env.data.RATE_LIMIT_WINDOW_MS),
    maxRequests: parseInt(env.data.RATE_LIMIT_MAX_REQUESTS),
  },
};