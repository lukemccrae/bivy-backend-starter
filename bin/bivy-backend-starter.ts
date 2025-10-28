#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { BivyBackendStarterStack } from '../lib/bivy-backend-starter-stack';

const app = new cdk.App();
new BivyBackendStarterStack(app, 'BivyBackendStarterStack', {
  env: {
    region: process.env.CDK_DEFAULT_REGION,
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
});
