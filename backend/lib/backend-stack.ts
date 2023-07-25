import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodeJs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as awslogs from 'aws-cdk-lib/aws-logs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as apigatewayv2 from '@aws-cdk/aws-apigatewayv2-alpha';
import * as apigatewayv2lambda from '@aws-cdk/aws-apigatewayv2-integrations-alpha';

export interface Config {
  tableName: string;
  domain: string;
  oidc?: {
    clientId: string;
    clientSecret: string;
    issuerUrl: string;
  },
  callbackUrls?: string[];
  logoutUrls?: string[];
}

interface BackendStackProps extends Config, cdk.StackProps {
  disableAuthorizer: boolean;
  debug: boolean;
}

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: BackendStackProps) {
    super(scope, id, props);

    const {
      tableName,
      disableAuthorizer,
      domain,
      oidc,
      callbackUrls,
      logoutUrls,
      debug,
    } = props;

    const userPool = new cognito.UserPool(this, "CognitoUserPool", {
      userPoolName: `theater-schedule-book-user-pool`,
      signInAliases: {
        username: false,
        email: true,
        preferredUsername: false,
        phone: false,
      },
      autoVerify: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
        },
        preferredUsername: {
          required: false,
        },
        phoneNumber: {
          required: false,
        },
      },
      mfa: cognito.Mfa.OFF,
      passwordPolicy: {
        minLength: 8,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    userPool.addDomain('UserPoolDomain', {
      cognitoDomain: {
        domainPrefix: domain,
      },
    });

    const identityProviderConfig = (() => {
      if (oidc) {
        const providerName = 'AzureAD';
        const provider = new cognito.CfnUserPoolIdentityProvider(
          this,
          'CfnCognitoIdPAzureAD',
          {
            providerName,
            providerDetails: {
              client_id: oidc.clientId,
              client_secret: oidc.clientSecret,
              oidc_issuer: oidc.issuerUrl,
              authorize_scopes: 'openid email',
              attributes_request_method: 'GET'
            },
            providerType: 'OIDC',
            attributeMapping: {
              'email': 'email',
              'email_verified': 'email_verified',
              'family_name': 'surname',
              'given_name': 'givenname',
              'name': 'name',
              'preferredUsername': 'name',
            },
            userPoolId: userPool.userPoolId,
          },
        );

        userPool.registerIdentityProvider(
          cognito.UserPoolIdentityProvider.fromProviderName(
            this,
            'CognitoIdPAzureAD',
            providerName,
          ),
        );
        return {
          provider,
          supportedIdentityProviders: [cognito.UserPoolClientIdentityProvider.custom(providerName)]
        };
      }
      return undefined;
    })();

    const client = new cognito.UserPoolClient(this, 'CognitoAppClient', {
      userPool: userPool,
      userPoolClientName: 'theater-schedule-book',
      authFlows: {
        adminUserPassword: true,
        userSrp: true,
        userPassword: true,
      },
      oAuth: {
        callbackUrls,
        logoutUrls,
        flows: {
          authorizationCodeGrant: true,
          implicitCodeGrant: true,
        },
        scopes: [
          cognito.OAuthScope.COGNITO_ADMIN,
          cognito.OAuthScope.EMAIL,
          cognito.OAuthScope.OPENID,
          cognito.OAuthScope.PROFILE,
        ],
      },
      readAttributes: new cognito.ClientAttributes().withStandardAttributes({
        email: true,
        familyName: true,
        givenName: true,
        fullname: true,
        preferredUsername: true,
        emailVerified: true,
        profilePage: true,
      }),
      writeAttributes: new cognito.ClientAttributes().withStandardAttributes({
        email: true,
        familyName: true,
        givenName: true,
        fullname: true,
        preferredUsername: true,
        profilePage: true,
      }),
      supportedIdentityProviders: identityProviderConfig?.supportedIdentityProviders,
    });
    if (identityProviderConfig) {
      client.node.addDependency(identityProviderConfig.provider);
    }

    const identityPoolProvider = {
      clientId: client.userPoolClientId,
      providerName: userPool.userPoolProviderName,
    };
    const identityPool = new cognito.CfnIdentityPool(
      this,
      'CognitoIdPool',
      {
        allowUnauthenticatedIdentities: false,
        allowClassicFlow: true,
        cognitoIdentityProviders: [identityPoolProvider],
        identityPoolName: 'theater-schedule-book',
      },
    );

    const unauthenticatedRole = new iam.Role(
      this,
      'CognitoDefaultUnauthenticatedRole',
      {
        roleName: 'theater-schedule-book-unauth-role',
        assumedBy: new iam.FederatedPrincipal(
          'cognito-identity.amazonaws.com',
          {
            'StringEquals': {
              'cognito-identity.amazonaws.com:aud': identityPool.ref,
            },
            'ForAnyValue:StringLike': {
              'cognito-identity.amazonaws.com:amr': 'unauthenticated',
            },
          },
          'sts:AssumeRoleWithWebIdentity',
        ),
        maxSessionDuration: cdk.Duration.hours(12),
        inlinePolicies: {
          'cognito-identity-policy': new iam.PolicyDocument({
            statements: [
              new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: ['cognito-sync:*', 'cognito-identity:*'],
                resources: ['*'],
              }),
            ],
          }),
          'sts-policy': new iam.PolicyDocument({
            statements: [
              new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: ['sts:*'],
                resources: ['*'],
              }),
            ],
          })
        },
      },
    );

    const authenticatedRole = new iam.Role(
      this,
      'CognitoDefaultAuthenticatedRole',
      {
        roleName: 'theater-schedule-book-auth-role',
        assumedBy: new iam.FederatedPrincipal(
          'cognito-identity.amazonaws.com',
          {
            'StringEquals': {
              'cognito-identity.amazonaws.com:aud': identityPool.ref,
            },
            'ForAnyValue:StringLike': {
              'cognito-identity.amazonaws.com:amr': 'authenticated',
            },
          },
          'sts:AssumeRoleWithWebIdentity',
        ).withSessionTags(),
        maxSessionDuration: cdk.Duration.hours(12),
        inlinePolicies: {
          'cognito-identity-policy': new iam.PolicyDocument({
            statements: [
              new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: ['cognito-sync:*', 'cognito-identity:*'],
                resources: ['*'],
              }),
            ],
          }),
          'sts-policy': new iam.PolicyDocument({
            statements: [
              new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: ['sts:*'],
                resources: ['*'],
              }),
            ],
          })
        },
      },
    );

    new cognito.CfnIdentityPoolRoleAttachment(
      this,
      'CognitoIdPoolRoleAttachment',
      {
        identityPoolId: identityPool.ref,
        roles: {
          'authenticated': authenticatedRole.roleArn,
          'unauthenticated': unauthenticatedRole.roleArn,
        },
      },
    );


    const functionName = 'theater-schedule-book';
    const functionLogs = new awslogs.LogGroup(this, 'LambdaFunctionLogGroup', {
      logGroupName: `/aws/lambda/${functionName}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      retention: awslogs.RetentionDays.ONE_DAY,
    });

    const roleName = `${functionName}-role`;

    const commandHooks = {
      beforeInstall(): string[] {
        return [''];
      },
      beforeBundling(): string[] {
        return [''];
      },
      afterBundling(inputDir: string, outputDir: string): string[] {
        return [
          // スキーマ定義を追加
          `cp ${inputDir}/../schema.gql ${outputDir}`,
        ];
      },
    };
    const lambdaOptions = debug ? {
      environment: {
        NODE_OPTIONS: '--enable-source-maps',
      },
      bundling: {
        minify: true,
        sourceMap: true,
        sourceMapMode: lambdaNodeJs.SourceMapMode.BOTH,
        sourcesContent: true,
        keepNames: true,
        commandHooks,
      },
    } : {
      bundling: {
        minify: true,
        keepNames: true,
        commandHooks,
      },
    };
    const lambdaFunction = new lambdaNodeJs.NodejsFunction(this, 'LambdaFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: './lambda/index.ts',
      functionName,
      retryAttempts: 0,
      timeout: cdk.Duration.seconds(30),
      ...lambdaOptions,
      role: new iam.Role(this, 'LambdaFunctionExecutionRole', {
        roleName,
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        inlinePolicies: {
          'logs-policy': new iam.PolicyDocument({
            statements: [
              new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: [
                  'logs:CreateLogStream',
                  'logs:PutLogEvents',
                ],
                resources: [`${functionLogs.logGroupArn}:*`],
              }),
            ],
          }),
          'cognito-policy': new iam.PolicyDocument({
            statements: [
              new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: [
                  'cognito-identity:*',
                  'cognito-idp:*',
                ],
                resources: ['*'],
              }),
            ],
          }),
        },
      }),
    });

    const api = new apigateway.RestApi(this, 'RestApi', {
      restApiName: `Theater Schedule Book GraphQL API`,
      deployOptions: {
        stageName: 'default',
      },
      endpointConfiguration: {
        types: [
          apigateway.EndpointType.REGIONAL,
        ],
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
        allowCredentials: true,
        disableCache: true,
        statusCode: 204,
      },
    });
    api.deploymentStage.urlForPath('/');
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const methodOptions = () => {
      if (disableAuthorizer) {
        const authorizer = new apigateway.CognitoUserPoolsAuthorizer(this, 'Authorizer', {
          authorizerName: 'Authorizer',
          cognitoUserPools: [userPool],
        });

        return {
          authorizer,
        };
      }
      return {};
    };
    api.root.addMethod(
      'ANY',
      new apigateway.LambdaIntegration(
        lambdaFunction,
      ),
      methodOptions(),
    );

    // eslint-disable-next-line no-new
    new apigateway.GatewayResponse(this, 'UnauthorizedGatewayResponse', {
      restApi: api,
      type: apigateway.ResponseType.UNAUTHORIZED,
      statusCode: '401',
      responseHeaders: {
        'Access-Control-Allow-Origin': '\'*\'',
      },
    });

    // eslint-disable-next-line no-new
    new apigateway.GatewayResponse(this, 'ClientErrorGatewayResponse', {
      restApi: api,
      type: apigateway.ResponseType.DEFAULT_4XX,
      responseHeaders: {
        'Access-Control-Allow-Origin': '\'*\'',
      },
    });

    // eslint-disable-next-line no-new
    new apigateway.GatewayResponse(this, 'ServerErrorGatewayResponse', {
      restApi: api,
      type: apigateway.ResponseType.DEFAULT_5XX,
      responseHeaders: {
        'Access-Control-Allow-Origin': '\'*\'',
      },
    });

    new apigatewayv2.WebSocketApi(this, 'WebSocketApi', {
      apiName: 'Theater Schedule Book Lambda WebSocket API',
    }).addRoute('$connect', {
      integration: new apigatewayv2lambda.WebSocketLambdaIntegration(
        'scheme-handler',
        lambdaFunction,
      ),
    });

    new dynamodb.Table(this, 'DynamoDBTable', {
      tableName,
      partitionKey: {
        name: 'user',
        type: dynamodb.AttributeType.STRING
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    new ssm.StringParameter(this, 'CognitoDomainUrl', {
      parameterName: `/theater-schedule-book/CognitoDomainUrl`,
      stringValue: `https://${domain}.auth.${this.region}.amazoncognito.com`,
    });

    new ssm.StringParameter(this, 'CognitoAppClientIdl', {
      parameterName: `/theater-schedule-book/CognitoAppClientId`,
      stringValue: client.userPoolClientId,
    });
  }
}
