import * as cdk from 'aws-cdk-lib';
import { Bucket, BucketAccessControl, HttpMethods } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class StackStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.createClientBucket('Login', 'login', 'login');
    this.createClientBucket('Account', 'account', 'account');
    this.createClientBucket('Landing', 'landing');
  }

  createClientBucket(name: string, packagePath: string, s3Path?: string)
  {
    var clientBucket = new Bucket(this, name, {
      accessControl: BucketAccessControl.PRIVATE,
      cors: [
        {
          allowedOrigins: ['*'],
          allowedMethods: [HttpMethods.GET],
          maxAge: 3000,
        }
      ]
    });
    new BucketDeployment(this, `Deploy${name}`, {
      sources: [Source.asset(`./${packagePath}/build`)],
      destinationBucket: clientBucket,
      destinationKeyPrefix: s3Path,
    });
  }
}
