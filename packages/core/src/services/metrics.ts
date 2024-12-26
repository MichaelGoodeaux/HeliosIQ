// packages/core/src/services/metrics.ts

import axios from 'axios';
import { SecurityUtils, logger } from '@heliosiq/shared';
import { config } from '../config';
import { MetricQuery, MetricData } from '../types';

export class MetricsService {
  private prometheusUrl: string;

  constructor() {
    this.prometheusUrl = config.monitoring.prometheusUrl;
  }

  /**
   * Query metrics with security validation
   */
  async queryMetrics(query: MetricQuery): Promise<MetricData[]> {
    try {
      // Validate and sanitize query
      const sanitizedQuery = SecurityUtils.sanitizeInput(query.query);

      // Perform the Prometheus query
      const response = await axios.get(`${this.prometheusUrl}/api/v1/query`, {
        params: {
          query: sanitizedQuery,
          time: query.timeRange.end.getTime() / 1000,
        },
        timeout: 5000,
      });

      if (response.data.status !== 'success') {
        throw new Error(`Prometheus query failed: ${response.data.error}`);
      }

      // Transform and validate response
      const metrics = this.transformMetrics(response.data.data);

      // Encrypt sensitive data
      return this.encryptSensitiveData(metrics);
    } catch (error) {
      logger.error('Error querying metrics:', error);
      throw error;
    }
  }

  /**
   * Get resource usage metrics
   */
  async getResourceMetrics(resourceType: string): Promise<MetricData[]> {
    try {
      const query = {
        query: `sum(rate(${SecurityUtils.sanitizeInput(resourceType)}[5m])) by (instance)`,
        timeRange: {
          start: new Date(Date.now() - 3600000),
          end: new Date(),
        },
      };

      return this.queryMetrics(query);
    } catch (error) {
      logger.error('Error getting resource metrics:', error);
      throw error;
    }
  }

  /**
   * Transform raw metric data
   */
  private transformMetrics(data: any): MetricData[] {
    return data.result.map((result: any) => ({
      name: result.metric.__name__,
      values: result.values.map((value: [number, string]) => ({
        timestamp: value[0] * 1000,
        value: parseFloat(value[1]),
      })),
      labels: result.metric,
    }));
  }

  /**
   * Encrypt sensitive metric data
   */
  private encryptSensitiveData(metrics: MetricData[]): MetricData[] {
    const sensitiveLabels = ['user', 'ip', 'email'];

    return metrics.map(metric => ({
      ...metric,
      labels: Object.entries(metric.labels).reduce((acc, [key, value]) => {
        acc[key] = sensitiveLabels.includes(key)
          ? SecurityUtils.encrypt(String(value))
          : value;
        return acc;
      }, {} as Record<string, string>),
    }));
  }
}