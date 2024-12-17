import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class HeliosLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create an S3 bucket
    const bucket = new s3.Bucket(this, 'MyBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY, // This will delete the bucket on stack removal
    });

    // Define the Lambda function
    const lambdaFunction = new lambda.Function(this, 'MyLambdaFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,  // Using Node.js runtime
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
        const { fromEnv } = require("@aws-sdk/credential-provider-env");

        exports.handler = async (event) => {
          const bucketName = process.env.BUCKET_NAME;
          const objectKey = "example.txt";  // Example object key in S3

          const s3Client = new S3Client({
            region: 'us-east-1',  // Specify the region
            credentials: fromEnv(), // Fetch credentials from the environment
          });

          try {
            const command = new GetObjectCommand({
              Bucket: bucketName,
              Key: objectKey,
            });

            const data = await s3Client.send(command);
            const body = data.Body;
            if (body instanceof ReadableStream) {
              const reader = body.getReader();
              const chunks = [];
              let done = false;
              while (!done) {
                const { value, done: chunkDone } = await reader.read();
                chunks.push(value);
                done = chunkDone;
              }
              const content = Buffer.concat(chunks).toString('utf-8');
              return {
                statusCode: 200,
                body: content,  // Return the file content from S3
              };
            }
          } catch (error) {
            console.error('Error downloading object:', error);
            return {
              statusCode: 500,
              body: 'Error fetching object from S3',
            };
          }
        };
      `),
      environment: {
        BUCKET_NAME: bucket.bucketName,  // Set the S3 bucket name as an environment variable
      },
    });

    // Grant the Lambda function permission to access the S3 bucket
    bucket.grantRead(lambdaFunction);

    // Optional: Output the bucket name
    new cdk.CfnOutput(this, 'BucketName', {
      value: bucket.bucketName,
    });
  }
}
