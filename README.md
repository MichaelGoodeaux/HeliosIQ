# HeliosIQ
An AI-powered metrics monitoring and incident management system integrating Prometheus, Grafana, and a self-hosted LLM for dynamic queries, anomaly detection, and intelligent recommendations.

```bash
HeliosIQ/
├── .github/                           # GitHub configuration and workflows (e.g., CI/CD, Issue templates)
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md              # Template for bug reports
│   │   └── feature_request.md         # Template for feature requests
│   ├── workflows/
│   │   ├── ci.yml                     # Continuous Integration workflow
│   │   └── terraform.yml              # Terraform-related CI workflow
├── .gitignore                         # Specifies files and directories to be ignored by Git
├── LICENSE                            # Apache 2.0 License file
├── SECURITY.md                        # Security guidelines and best practices
├── CONTRIBUTING.md                    # Contribution guidelines
├── README.md                          # Project overview and setup instructions
├── CODE_OF_CONDUCT.md                 # Code of conduct for contributing to the project
├── docs/                              # Documentation files
│   ├── api.md                         # API documentation
│   ├── architecture.md                # Architecture overview and design decisions
│   └── setup.md                       # Setup instructions for development or deployment
├── src/                               # Application and infrastructure source code
│   ├── app/                           # Application code (business logic, API, etc.)
│   │   ├── api/                       # API-related code
│   │   │   ├── index.ts               # API entry point
│   │   │   └── routes.ts              # API route definitions
│   │   ├── services/                  # Core services like anomaly detection, recommendations
│   │   │   ├── anomalyDetectionService.ts
│   │   │   └── recommendationsService.ts
│   │   └── utils/                     # Utility functions (e.g., query utilities)
│   │       └── queryUtils.ts
│   ├── infrastructure/                # Infrastructure as Code (IaC) tools
│   │   ├── aws/                       # AWS-specific resources and services (CDK, Lambda, S3, etc.)
│   │   │   ├── s3.ts                  # AWS S3-related logic and infrastructure
│   │   │   └── lambda.ts              # AWS Lambda-related logic and infrastructure
│   │   ├── kubernetes/                # Kubernetes-related configurations and services
│   │   │   ├── deployment.yaml        # Kubernetes deployment configurations
│   │   │   └── service.yaml           # Kubernetes service configurations
│   │   ├── terraform/                 # Terraform configurations for multi-environment deployments
│   │   │   ├── environments/          # Folder containing environment-specific configurations (dev, staging, prod)
│   │   │   │   ├── dev/               # Dev environment-specific configurations
│   │   │   │   │   ├── main.tf        # Main Terraform configuration
│   │   │   │   │   ├── providers.tf   # Providers configuration
│   │   │   │   │   ├── outputs.tf     # Outputs configuration
│   │   │   │   │   └── variables.tf   # Variables configuration
│   │   │   │   ├── staging/           # Staging environment-specific configurations
│   │   │   │   ├── prod/              # Production environment-specific configurations
│   │   │   ├── modules/               # Terraform reusable modules (e.g., VPC, EC2, S3, etc.)
│   │   │   │   ├── vpc/               # VPC module
│   │   │   │   ├── ec2-instance/      # EC2 instance module
│   │   │   │   └── s3-bucket/         # S3 bucket module
│   │   ├── docker/                    # Docker-related configurations
│   │   │   ├── Dockerfile             # Dockerfile for building the application container
│   │   │   └── docker-compose.yml     # Docker Compose configuration for multi-container setup
│   ├── monitoring/                    # Monitoring-related tools and services (Prometheus, Grafana, etc.)
│   │   ├── helm/                      # Helm charts for Kubernetes deployment
│   │   │   ├── charts/                # Folder for Helm charts
│   │   │   │   ├── heliosiq/          # HeliosIQ Helm chart
│   │   │   │   ├── prometheus/        # Prometheus Helm chart
│   │   │   │   └── grafana/           # Grafana Helm chart
│   │   │   └── values.yaml            # Default values for the Helm charts
│   └── package.json                   # Node.js dependencies and scripts
├── tests/                             # Unit and integration tests for the application
│   ├── api.test.ts                    # API-related tests
│   ├── anomalyDetection.test.ts       # Anomaly detection service tests
│   ├── recommendations.test.ts        # Recommendations service tests
├── tsconfig.json                      # TypeScript configuration file
└── README.md                          # Project README (overview, setup, usage instructions)
```