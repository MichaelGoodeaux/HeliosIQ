// packages/shared/src/types/alerts.ts

/**
 * Alert types and interfaces
 */
export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  timestamp: Date;
  source: string;
  metadata?: Record<string, any>;
}

export interface AlertRule {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  duration: string;
  severity: AlertSeverity;
  actions: AlertAction[];
}

export interface AlertAction {
  type: 'slack' | 'email' | 'webhook';
  config: Record<string, any>;
}