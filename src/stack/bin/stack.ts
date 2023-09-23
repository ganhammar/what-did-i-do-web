#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { WhatDidIDoWebStack } from '../lib/what-did-i-do-web-stack';

const app = new App();
new WhatDidIDoWebStack(app, 'what-did-i-do-web-stack', {
  env: {
    region: 'eu-north-1',
  },
});
