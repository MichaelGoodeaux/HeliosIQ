#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AwsS3Stack } from '../lib/s3'; // Import your S3 stack class
import { AwsLambdaStack } from '../lib/lambda'; // Import your Lambda stack class

// Define the main stack
export class HeliosIQStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Instantiate and add S3 resources
    const s3Stack = new AwsS3Stack(this, 'HeliosIQ-S3Stack', {
      stackName: 'HeliosIQ-S3',
    });

    // Instantiate and add Lambda resources
    const lambdaStack = new AwsLambdaStack(this, 'HeliosIQ-LambdaStack', {
      stackName: 'HeliosIQ-Lambda',
    });

    // Optionally, link stacks together if needed
    // For example, you could pass S3 resources to Lambda resources
    // lambdaStack.addDependency(s3Stack);
  }
}

// Initialize the CDK app and add the stack to the app
const app = new cdk.App();
new HeliosIQStack(app, 'HeliosIQStack');
