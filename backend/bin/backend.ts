#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {BackendStack, Config} from '../lib/backend-stack';

const app = new cdk.App();

const debug = app.node.tryGetContext('debug') === 'true';
const context = app.node.tryGetContext('config') as Config;
const disableAuthorizer =
  app.node.tryGetContext('disable-authorizer') === 'true';

new BackendStack(app, 'theater-schedule-book-backend-stack', {
  ...context,
  disableAuthorizer,
  debug
});
