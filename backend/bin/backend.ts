#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { BackendStack } from '../lib/backend-stack';

interface EnvProps {
  domain: string;
}

const app = new cdk.App();

const env = app.node.tryGetContext('env') as string;
const context = app.node.tryGetContext(env) as EnvProps;
const identityProviderMetadataURL = app.node.tryGetContext('metaURL') as
  | string
  | undefined;

new BackendStack(app, 'theater-schedule-book-backend-stack', {
  environment: env,
  ...context,
  identityProviderMetadataURL,
});