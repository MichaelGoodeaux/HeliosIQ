// anomalyDetectionService.ts
// Service for detecting anomalies in data using statistical methods or machine learning.

import { Logger } from '../utils/loggerUtils';

// Placeholder for types
interface AnomalyResult {
    anomalies: number[];
    message: string;
}

interface DataPoint {
    timestamp: string;
    value: number;
}

// Logger instance
const logger = new Logger('AnomalyDetectionService');

export class AnomalyDetectionService {
    private threshold: number;

    constructor(threshold: number = 2.5) {
        // Threshold for Z-score-based anomaly detection
        this.threshold = threshold;
        logger.info(`AnomalyDetectionService initialized with threshold ${threshold}`);
    }

    /**
     * Detect anomalies in a dataset based on Z-score.
     * @param data Array of DataPoint { timestamp: string, value: number }
     * @returns AnomalyResult containing detected anomalies and summary
     */
    public detectAnomalies(data: DataPoint[]): AnomalyResult {
        if (!data || data.length === 0) {
            logger.warn('Empty dataset provided for anomaly detection.');
            return { anomalies: [], message: 'No data provided' };
        }

        const values = data.map((point) => point.value);
        const mean = this.calculateMean(values);
        const stdDev = this.calculateStdDev(values, mean);

        logger.info(`Mean: ${mean}, StdDev: ${stdDev}`);

        const anomalies = data
            .filter((point) => Math.abs((point.value - mean) / stdDev) > this.threshold)
            .map((point) => point.value);

        logger.info(`${anomalies.length} anomalies detected`);

        return {
            anomalies,
            message: anomalies.length > 0 ? 'Anomalies detected' : 'No anomalies detected',
        };
    }

    /**
     * Calculate mean of an array of numbers.
     * @param values Array of numeric values
     * @returns Mean value
     */
    private calculateMean(values: number[]): number {
        const sum = values.reduce((acc, val) => acc + val, 0);
        return sum / values.length;
    }

    /**
     * Calculate standard deviation of an array of numbers.
     * @param values Array of numeric values
     * @param mean Mean of the values
     * @returns Standard deviation
     */
    private calculateStdDev(values: number[], mean: number): number {
        const squaredDiffs = values.map((val) => Math.pow(val - mean, 2));
        const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / values.length;
        return Math.sqrt(variance);
    }
}