// packages/shared/src/utils/formatting.ts

/**
 * Date formatting utilities
 */
export const dateUtils = {
  formatDate(date: Date): string {
    return date.toISOString();
  },

  formatDuration(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return `${seconds}s`;
  },
};

/**
 * Metric formatting utilities
 */
export const metricUtils = {
  formatBytes(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let value = bytes;
    let unitIndex = 0;

    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex++;
    }

    return `${value.toFixed(2)} ${units[unitIndex]}`;
  },

  formatPercentage(value: number): string {
    return `${(value * 100).toFixed(2)}%`;
  },

  formatNumber(value: number): string {
    return new Intl.NumberFormat().format(value);
  },
};

/**
 * Alert formatting utilities
 */
export const alertUtils = {
  getSeverityColor(severity: string): string {
    const colors = {
      critical: '#FF0000',
      high: '#FFA500',
      medium: '#FFFF00',
      low: '#00FF00',
    } as const;

    if (severity in colors) {
      return colors[severity as keyof typeof colors];
    }
    return '#808080'; // Default color
  },

  getSeverityIcon(severity: string): string {
    const icons = {
      critical: '🔴',
      high: '🟠',
      medium: '🟡',
      low: '🟢',
    } as const;

    if (severity in icons) {
      return icons[severity as keyof typeof icons];
    }
    return '⚪'; // Default icon
  },
};