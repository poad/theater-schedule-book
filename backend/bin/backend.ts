#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {BackendStack, Config} from '../lib/backend-stack';

const app = new cdk.App();

const debug = app.node.tryGetContext('debug') === 'true';
const context = app.node.tryGetContext('config') as Config;
const disableAuthorizer =
  app.node.tryGetContext('disable-authorizer') === 'true';
const clientId = app.node.tryGetContext('client-id') as string;
const clientSecret = app.node.tryGetContext('client-secret') as string;
const issuerUrl = app.node.tryGetContext('issuer-url') as string;

new BackendStack(app, 'theater-schedule-book-backend-stack', {
  ...context,
  oidc: {
    clientId,
    clientSecret,
    issuerUrl
  },
  disableAuthorizer,
  debug
});
