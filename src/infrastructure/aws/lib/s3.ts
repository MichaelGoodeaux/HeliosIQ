import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { S3Client, ListObjectsV2Command, _Object, CreateBucketCommand, DeleteBucketCommand, PutObjectCommand, GetObjectCommand, ListObjectsV2CommandOutput } from '@aws-sdk/client-s3';
import { fromEnv } from '@aws-sdk/credential-provider-env';  // Use the environment variable to get credentials
import * as fs from 'fs';
import * as path from 'path';
import { Readable } from 'stream'; // Import Node.js stream module

export class AwsS3Stack extends cdk.Stack {
  private s3Client: S3Client;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Initialize the S3 client with region and credentials from the AWS_PROFILE environment variable
    this.s3Client = new S3Client({
      region: 'us-east-1',  // Specify your desired region
      credentials: fromEnv()  // Automatically uses the AWS_PROFILE environment variable
    });
  }

  // Function to create a new S3 bucket
  public async createBucket(bucketName: string): Promise<void> {
    try {
      const command = new CreateBucketCommand({
        Bucket: bucketName,
      });
      await this.s3Client.send(command);
      console.log(`Bucket ${bucketName} created successfully.`);
    } catch (error) {
      console.error('Error creating bucket:', error);
    }
  }

  // Function to delete an S3 bucket
  public async deleteBucket(bucketName: string): Promise<void> {
    try {
      const command = new DeleteBucketCommand({
        Bucket: bucketName,
      });
      await this.s3Client.send(command);
      console.log(`Bucket ${bucketName} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting bucket:', error);
    }
  }

  // Function to upload an object to S3
  public async uploadObject(bucketName: string, objectKey: string, fileContent: string | Buffer): Promise<void> {
    try {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: objectKey,
        Body: fileContent,
      });
      await this.s3Client.send(command);
      console.log(`Object ${objectKey} uploaded to bucket ${bucketName}.`);
    } catch (error) {
      console.error('Error uploading object:', error);
    }
  }

// Function to download an object from S3
public async downloadObject(bucketName: string, objectKey: string): Promise<void> {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });
    const data = await this.s3Client.send(command);
    console.log(`Object ${objectKey} downloaded from bucket ${bucketName}.`);

    // Ensure the body is a ReadableStream from the AWS SDK
    const body = data.Body;

    if (body instanceof Readable) {
      // Pipe the AWS ReadableStream to a Node.js writable stream (e.g., file)
      const filePath = path.join(__dirname, objectKey);
      const fileStream = fs.createWriteStream(filePath);
      body.pipe(fileStream);
    } else {
      console.log('Downloaded object is not a stream.');
    }
  } catch (error) {
    console.error('Error downloading object:', error);
  }
}

  // Function to list objects in a bucket
  public async listObjects(bucketName: string): Promise<void> {
    try {
      const command = new ListObjectsV2Command({
        Bucket: bucketName,
      });
      const data: ListObjectsV2CommandOutput = await this.s3Client.send(command);
      console.log('Objects in bucket:', data.Contents);

      // Safely log object keys with proper type annotation
      if (data.Contents && data.Contents.length > 0) {
        data.Contents.forEach((object: _Object) => {
          if (object.Key) {
            console.log(object.Key);
          }
        });
      } else {
        console.log('No objects found in the bucket.');
      }
    } catch (error) {
      console.error('Error listing objects:', error);
    }
  }
}