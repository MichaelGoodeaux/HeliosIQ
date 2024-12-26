// packages/shared/src/utils/validation.ts

import { z } from 'zod';
import { logger } from './logger';

/**
 * Base schema for common validations
 */
export const baseSchemas = {
  timeRange: z.object({
    start: z.date(),
    end: z.date(),
  }).refine(data => data.start < data.end, {
    message: "Start date must be before end date"
  }),

  metricFilter: z.object({
    label: z.string().min(1),
    value: z.string().min(1),
    operator: z.enum(['eq', 'ne', 'gt', 'lt', 'contains']),
  }),

  alert: z.object({
    severity: z.enum(['critical', 'high', 'medium', 'low']),
    title: z.string().min(1).max(100),
    description: z.string().min(1).max(1000),
    source: z.string().min(1),
    metadata: z.record(z.any()).optional(),
  }),
};

/**
 * Validation utility class
 */
export class ValidationUtils {
  /**
   * Validate data against schema
   */
  static validate<T>(data: unknown, schema: z.Schema<T>): T {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        logger.error('Validation error:', {
          errors: error.errors,
          data,
        });
        throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw error;
    }
  }

  /**
   * Validate metric query
   */
  static validateMetricQuery(query: unknown): void {
    const schema = z.object({
      query: z.string().min(1),
      timeRange: baseSchemas.timeRange,
      filters: z.array(baseSchemas.metricFilter).optional(),
    });

    this.validate(query, schema);
  }

  /**
   * Validate alert
   */
  static validateAlert(alert: unknown): void {
    this.validate(alert, baseSchemas.alert);
  }

  /**
   * Validate security context
   */
  static validateSecurityContext(context: unknown): void {
    const schema = z.object({
      userId: z.string().min(1),
      role: z.string().min(1),
      permissions: z.array(z.string()).min(1),
      metadata: z.record(z.any()).optional(),
    });

    this.validate(context, schema);
  }
}