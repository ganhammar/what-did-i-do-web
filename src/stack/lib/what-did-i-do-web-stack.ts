import { Stack, StackProps } from 'aws-cdk-lib';
import { PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Bucket, BucketAccessControl, HttpMethods } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

export class WhatDidIDoWebStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.createClientBucket('Login', 'login', 'login');
    this.createClientBucket('Account', 'account', 'account');
    this.createClientBucket('Landing', 'landing');
  }

  createClientBucket(name: string, packagePath: string, s3Path?: string) {
    var clientBucket = new Bucket(this, name, {
      accessControl: BucketAccessControl.PRIVATE,
      cors: [
        {
          allowedOrigins: ['*'],
          allowedMethods: [HttpMethods.GET],
          maxAge: 3000,
        },
      ],
      bucketName: `what-did-i-do-web-${name.toLowerCase()}`,
    });

    var policyStatement = new PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [`${clientBucket.bucketArn}/*`],
      principals: [new ServicePrincipal('cloudfront.amazonaws.com')],
      conditions: {
        StringEquals: {
          'AWS:SourceArn':
            'arn:aws:cloudfront::519157272275:distribution/E2L0DHX73AANES',
        },
      },
    });

    clientBucket.addToResourcePolicy(policyStatement);

    new BucketDeployment(this, `Deploy${name}`, {
      sources: [Source.asset(`../../${packagePath}/build`)],
      destinationBucket: clientBucket,
      destinationKeyPrefix: s3Path,
    });
  }
}
