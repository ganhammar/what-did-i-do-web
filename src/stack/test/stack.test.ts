import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { WhatDidIDoWebStack } from '../lib/what-did-i-do-web-stack';

jest.mock('aws-cdk-lib/aws-s3-deployment');

describe('WhatDidIDoWebStack', () => {
  it('creates the expected s3 bucket', () => {
    const app = new App();
    const stack = new WhatDidIDoWebStack(app, 'MyTestStack');
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::S3::Bucket', {
      AccessControl: 'Private',
    });
  });
});
