// packages/core/src/types/index.ts

export interface MetricQuery {
  query: string;
  timeRange: {
    start: Date;
    end: Date;
  };
  filters?: Record<string, string>;
}

export interface MetricData {
  name: string;
  values: Array<{
    timestamp: number;
    value: number;
  }>;
  labels: Record<string, string>;
}

export interface Alert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
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
  severity: Alert['severity'];
  actions: Array<{
    type: string;
    config: Record<string, any>;
  }>;
}