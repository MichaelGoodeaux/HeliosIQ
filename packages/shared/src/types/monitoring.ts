// packages/shared/src/types/monitoring.ts

/**
 * Metric types and interfaces
 */
export interface MetricQuery {
  query: string;
  timeRange: TimeRange;
  filters?: MetricFilter[];
}

export interface TimeRange {
  start: Date;
  end: Date;
}

export interface MetricFilter {
  label: string;
  value: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'contains';
}

export interface MetricValue {
  timestamp: number;
  value: number;
  labels?: Record<string, string>;
}

export interface MetricData {
  name: string;
  values: MetricValue[];
  metadata?: Record<string, any>;
}