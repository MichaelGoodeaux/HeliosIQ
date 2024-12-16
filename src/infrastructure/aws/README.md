# HeliosIQ AWS Infrastructure

This directory contains the AWS infrastructure setup for the **HeliosIQ** platform, which uses AWS CDK to provision and manage resources like **S3**, **Lambda**, and other AWS services.

## Overview

The AWS infrastructure for HeliosIQ is defined using AWS CDK (Cloud Development Kit). The core components of the system include:

- **S3 Buckets** for storing and managing static objects.
- **Lambda Functions** for serverless compute that integrates with S3 for various use cases such as dynamic query interfaces, anomaly detection, recommendations, and incident triage.

## Files

- **`bin/aws.ts`**: Entry point for the CDK application. Defines the main stack and initializes the resources for deployment, such as S3 buckets and Lambda functions.
- **`lib/s3.ts`**: Defines S3 resources and provides functions to manage them, such as creating/deleting buckets and uploading/downloading objects.
- **`lib/lambda.ts`**: Defines Lambda functions, including their creation and configuration, and links them to events like S3 uploads.

## Prerequisites

1. **Node.js** (version 20.x or later)
2. **AWS CLI** installed and configured with credentials (`aws configure`)
3. **AWS CDK** installed globally (`npm install -g aws-cdk`)

## Setup and Deployment

Follow these steps to set up and deploy the AWS infrastructure for HeliosIQ:

### 1. Install Dependencies

In the `aws/` folder, run the following command to install the required dependencies:

```bash
npm install
```

### 2. Bootstrap the CDK Environment

If this is your first time deploying the infrastructure, you need to bootstrap the environment to set up necessary resources (e.g., S3 buckets, IAM roles):

```bash
cdk bootstrap
```

### 3. Deploy the Stack

Deploy the infrastructure using the following command:

```bash
cdk deploy
```

This will create or update the resources defined in your CDK stack. The output will show the progress and any resources created.

### 4. Clean Up Resources

To destroy the resources created by CDK, use the following command:

```bash
cdk destroy
```

This will delete all the resources defined in the stack (e.g., S3 buckets, Lambda functions, etc.).

## Configuring AWS Credentials

The AWS CDK uses your AWS credentials to deploy resources. By default, it looks for credentials stored in your AWS configuration file (`~/.aws/credentials`). If you need to use a specific AWS profile, you can set the `AWS_PROFILE` environment variable before running the CDK commands:

```bash
export AWS_PROFILE=your-profile-name
```

## Lambda Functions

In the `lib/lambda.ts` file, you define your Lambda functions. These functions can be triggered by events such as S3 uploads. Make sure your Lambda functions have the necessary permissions to interact with other AWS resources.

## S3 Buckets

In the `lib/s3.ts` file, you define S3 buckets. These buckets can be used for a variety of purposes, such as storing logs, backups, or user-generated content.

## Contributing

If you'd like to contribute to the development of HeliosIQ or extend the infrastructure, please follow the guidelines in the [Contributing](../CONTRIBUTING.md) file. This includes the process for submitting pull requests and reporting issues.

## License

This project is licensed under the Apache 2.0 License. See the [LICENSE](../LICENSE) file for more details.