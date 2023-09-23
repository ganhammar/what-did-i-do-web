#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { StackStack } from '../lib/stack-stack';

const app = new cdk.App();
new StackStack(app, 'what-did-i-do-web-stack', {
  env: {
    region: 'eu-north-1',
  },
});
