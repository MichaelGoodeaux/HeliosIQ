# Core Service

The `core` package provides essential services and configurations for interacting with monitoring systems and managing alerts and metrics. This module is part of the HeliosIQ project and leverages secure API integrations for monitoring and alerting functionalities.

## Overview

This package handles the configuration and setup for interacting with external monitoring services, such as Prometheus and Grafana, and includes services for managing alerts and querying metrics. It also integrates encryption and sanitization mechanisms for sensitive data.

### Key Features

- **Configuration**: The configuration module reads environment variables for connecting to Prometheus, Grafana, and AlertManager. It also validates the presence of necessary environment variables.
- **Alerting**: The `AlertService` enables the creation, retrieval, and status updates of alerts, with support for encryption and sanitization of sensitive data.
- **Metrics**: The `MetricsService` facilitates querying of Prometheus metrics, with support for time-based filtering and encryption of sensitive data.

## Installation

To install this package, run the following command:

`npm install @heliosiq/core`

## Configuration

The `core` package relies on several environment variables for proper configuration. These variables can be set in your environment or within a `.env` file.

### Required Environment Variables

- **PROMETHEUS_URL**: The URL for the Prometheus server.
- **GRAFANA_URL**: The URL for the Grafana server.
- **ALERTMANAGER_URL**: The URL for the AlertManager server.
- **API_KEY**: A 32-character minimum API key for authorization with the monitoring services.
- **ENCRYPTION_KEY**: A 32-character minimum encryption key for securing sensitive data.
- **RATE_LIMIT_WINDOW_MS**: The rate limit window in milliseconds.
- **RATE_LIMIT_MAX_REQUESTS**: The maximum number of requests allowed within the rate limit window.

### Example `.env` File

```
PROMETHEUS_URL=https://prometheus.example.com 
GRAFANA_URL=https://grafana.example.com 
ALERTMANAGER_URL=https://alertmanager.example.com 
API_KEY=your-api-key-here 
ENCRYPTION_KEY=your-encryption-key-here 
RATE_LIMIT_WINDOW_MS=1000 
RATE_LIMIT_MAX_REQUESTS=100
```

## Usage

### Config Module

The `config` module reads the environment variables and validates them. If any required variables are missing or invalid, the application will terminate with an error message.

```ts
import { config } from '@heliosiq/core';

// Access configuration properties
const prometheusUrl = config.monitoring.prometheusUrl;
```

### Alerts Service
The `AlertService` provides methods for creating, fetching, and updating alerts.

#### Create Alert
```ts
import { AlertService } from '@heliosiq/core';

const alertService = new AlertService();

const alert = {
  id: 'alert-123',
  severity: 'critical',
  title: 'High CPU Usage',
  description: 'CPU usage exceeds threshold',
  timestamp: new Date(),
};

await alertService.createAlert(alert);
```

#### Get Alerts

```ts
const alerts = await alertService.getAlerts({
  severity: 'critical',
});
```

Update Alert Status
```ts
await alertService.updateAlertStatus('alert-123', 'resolved');
```

### Metrics Service
The `MetricsService` provides methods for querying Prometheus metrics.

#### Query Metrics
```ts
import { MetricsService } from '@heliosiq/core';

const metricsService = new MetricsService();

const query = {
  query: 'up{job="my-service"}',
  timeRange: {
    start: new Date(Date.now() - 3600000), // 1 hour ago
    end: new Date(),
  },
};

const metrics = await metricsService.queryMetrics(query);
```

#### Get Resource Metrics
```ts
const resourceMetrics = await metricsService.getResourceMetrics('cpu_usage');
```

### Types

The `types` module includes type definitions for the data structures used in the services.

#### Alerts
```ts
interface Alert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  timestamp: Date;
  source: string;
  metadata?: Record<string, any>;
}
```

#### MetricQuery
```ts
interface MetricQuery {
  query: string;
  timeRange: {
    start: Date;
    end: Date;
  };
  filters?: Record<string, string>;
}
```

#### MetricData
```ts
interface MetricData {
  name: string;
  values: Array<{
    timestamp: number;
    value: number;
  }>;
  labels: Record<string, string>;
}
```