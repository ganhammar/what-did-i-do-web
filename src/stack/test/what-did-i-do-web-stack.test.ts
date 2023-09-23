import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { WhatDidIDoWebStack } from '../lib/what-did-i-do-web-stack';
import { Bucket, CfnBucket } from 'aws-cdk-lib/aws-s3';

jest.mock('aws-cdk-lib/aws-s3-deployment');

describe('WhatDidIDoWebStack', () => {
  ['Login', 'Account', 'Landing'].forEach((name) => {
    it(`creates the ${name.toLowerCase()} s3 bucket`, () => {
      const app = new App();
      const stack = new WhatDidIDoWebStack(app, 'MyTestStack');
      const template = Template.fromStack(stack);

      template.hasResourceProperties('AWS::S3::Bucket', {
        AccessControl: 'Private',
        BucketName: `what-did-i-do-web-${name.toLowerCase()}`,
      });

      const bucket = stack.node.tryFindChild(name);

      expect(bucket).toBeDefined();
      expect(bucket instanceof Bucket).toBe(true);
      expect(bucket?.node.defaultChild instanceof CfnBucket).toBe(true);
    });
  });
});
