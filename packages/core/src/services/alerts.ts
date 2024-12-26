// packages/core/src/services/alerts.ts

import axios from 'axios';
import { SecurityUtils, logger } from '@heliosiq/shared';
import { config } from '../config';
import { Alert } from '../types';

export class AlertService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.monitoring.alertmanagerUrl;
  }

  /**
   * Create new alert
   */
  async createAlert(alert: Alert): Promise<void> {
    try {
      // Validate alert data
      this.validateAlert(alert);

      // Encrypt sensitive data
      const secureAlert = this.encryptSensitiveData(alert);

      await axios.post(`${this.baseUrl}/api/v2/alerts`, secureAlert, {
        headers: {
          'Authorization': `Bearer ${config.security.apiKey}`,
        },
      });

      logger.info('Alert created:', { id: alert.id, severity: alert.severity });
    } catch (error) {
      logger.error('Error creating alert:', error);
      throw error;
    }
  }

  /**
   * Get alerts with filtering
   */
  async getAlerts(filters?: Record<string, string>): Promise<Alert[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/v2/alerts`, {
        headers: {
          'Authorization': `Bearer ${config.security.apiKey}`,
        },
        params: filters,
      });

      // Decrypt sensitive data
      return response.data.map(this.decryptSensitiveData);
    } catch (error) {
      logger.error('Error fetching alerts:', error);
      throw error;
    }
  }

  /**
   * Update alert status
   */
  async updateAlertStatus(id: string, status: string): Promise<void> {
    try {
      const sanitizedId = SecurityUtils.sanitizeInput(id);
      const sanitizedStatus = SecurityUtils.sanitizeInput(status);

      await axios.put(
        `${this.baseUrl}/api/v2/alerts/${sanitizedId}/status`,
        { status: sanitizedStatus },
        {
          headers: {
            'Authorization': `Bearer ${config.security.apiKey}`,
          },
        }
      );

      logger.info('Alert status updated:', { id, status });
    } catch (error) {
      logger.error('Error updating alert status:', error);
      throw error;
    }
  }

  /**
   * Validate alert data
   */
  private validateAlert(alert: Alert): void {
    if (!alert.id || !alert.severity || !alert.title) {
      throw new Error('Invalid alert data');
    }
  }

  /**
   * Encrypt sensitive alert data
   */
  private encryptSensitiveData(alert: Alert): Alert {
    return {
      ...alert,
      title: SecurityUtils.encrypt(alert.title),
      description: SecurityUtils.encrypt(alert.description),
      metadata: alert.metadata ? 
        Object.entries(alert.metadata).reduce((acc, [key, value]) => {
          acc[key] = typeof value === 'string' ? 
            SecurityUtils.encrypt(value) : value;
          return acc;
        }, {} as Record<string, string>) : undefined,
    };
  }

  /**
   * Decrypt sensitive alert data
   */
  private decryptSensitiveData(alert: Alert): Alert {
    return {
      ...alert,
      title: SecurityUtils.decrypt(alert.title),
      description: SecurityUtils.decrypt(alert.description),
      metadata: alert.metadata ? 
        Object.entries(alert.metadata).reduce((acc, [key, value]) => {
          acc[key] = typeof value === 'string' ? 
            SecurityUtils.decrypt(value) : value;
          return acc;
        }, {} as Record<string, string>) : undefined,
    };
  }
}