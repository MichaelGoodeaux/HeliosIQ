# @heliosiq/shared

`@heliosiq/shared` is a TypeScript utility package that provides common types, utilities, and validation schemas for use across the HeliosIQ ecosystem. It contains various modules that deal with alerts, metrics, security, formatting, logging, and validation.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Alert Types](#alert-types)
  - [Monitoring Types](#monitoring-types)
  - [Security Utilities](#security-utilities)
  - [Formatting Utilities](#formatting-utilities)
  - [Logging Utilities](#logging-utilities)
  - [Validation Utilities](#validation-utilities)
- [Development](#development)

## Installation

To install the package, run the following command:

```bash
npm install @heliosiq/shared
```

## Usage

### Alert Types

The `@heliosiq/shared` package provides types and interfaces to handle alert definitions and actions.

Example usage:

```ts
import { Alert, AlertSeverity, AlertAction } from '@heliosiq/shared';

const alert: Alert = {
  id: '1',
  severity: 'critical',
  title: 'CPU Overload',
  description: 'CPU usage exceeds threshold',
  timestamp: new Date(),
  source: 'System Monitor',
};

const alertAction: AlertAction = {
  type: 'slack',
  config: { webhookUrl: 'https://slack.com/webhook' },
};
```

### Monitoring Types

The package includes types to define metric queries, filters, and metric data.

Example usage:

```ts
import { MetricQuery, MetricFilter } from '@heliosiq/shared';

const query: MetricQuery = {
  query: 'cpu_usage > 80',
  timeRange: { start: new Date('2024-12-01'), end: new Date('2024-12-02') },
};

const filter: MetricFilter = {
  label: 'host',
  value: 'server1',
  operator: 'eq',
};
```

### Security Utilities

The package provides encryption, JWT handling, and sanitization utilities. These are useful for securing sensitive data and verifying authentication tokens.

Example usage:

```ts
import { SecurityUtils } from '@heliosiq/shared';

SecurityUtils.initialize('your-encryption-key');

// Encrypt and decrypt data
const encrypted = SecurityUtils.encrypt('Sensitive Data');
const decrypted = SecurityUtils.decrypt(encrypted);

// Generate and verify JWT
const token = await SecurityUtils.generateToken({
  userId: 'user1',
  role: 'admin',
  permissions: ['read', 'write'],
});
const context = await SecurityUtils.verifyToken(token);
```

### Formatting Utilities

The package provides utilities to format dates, durations, and metrics (e.g., bytes and percentages).

Example usage:

```ts
import { dateUtils, metricUtils } from '@heliosiq/shared';

const formattedDate = dateUtils.formatDate(new Date());
const formattedDuration = dateUtils.formatDuration(3600000); // "1h"

const formattedBytes = metricUtils.formatBytes(1048576); // "1.00 MB"
const formattedPercentage = metricUtils.formatPercentage(0.1234); // "12.34%"
```

### Logging Utilities

The package includes a logger configured using winston for secure and structured logging.

Example usage:

```ts
import { logger } from '@heliosiq/shared';

logger.info('Informational message');
logger.error('Error message');
```

### Validation Utilities

Validation utilities are provided using the zod library to validate common data types, such as alert data, metric queries, and security contexts.

Example usage:

```ts
import { ValidationUtils } from '@heliosiq/shared';

const alert = { severity: 'critical', title: 'Alert', description: 'Description' };
ValidationUtils.validateAlert(alert);

const metricQuery = { query: 'cpu_usage > 80', timeRange: { start: new Date(), end: new Date() } };
ValidationUtils.validateMetricQuery(metricQuery);

const securityContext = { userId: 'user1', role: 'admin', permissions: ['read'] };
ValidationUtils.validateSecurityContext(securityContext);
```

## Development

### Folder Structure
- src/: Contains the source code for the package.
    - types/: Contains type definitions for various components like alerts, monitoring, and security.
    - utils/: Contains utility functions for formatting, logging, security, and validation.
    - index.ts: The entry point for the package, exporting all utility functions and types.

### Build and Compile

To build the project, run:

```bash
npm run build
```

This will compile the TypeScript code into the dist/ directory.