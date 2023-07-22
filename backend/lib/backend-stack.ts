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

interface BackendStackProps extends cdk.StackProps {
  environment: string;
  domain: string;
  tableName: string;
  disableAuthorizer: boolean;
  identityProviderMetadataURL?: string;
  callbackUrls?: string[];
  logoutUrls?: string[];
}

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: BackendStackProps) {
    super(scope, id, props);

    const {
      environment,
      domain,
      tableName,
      disableAuthorizer,
      identityProviderMetadataURL,
      callbackUrls,
      logoutUrls,
    } = props;

    const userPool = new cognito.UserPool(this, "CognitoUserPool", {
      userPoolName: `${environment}-theater-schedule-book-user-pool`,
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

    const idpName = identityProviderMetadataURL
      ? new cognito.CfnUserPoolIdentityProvider(
        this,
        'CfnCognitoIdPAzureAD',
        {
          providerName: 'AzureAD',
          providerDetails: {
            MetadataURL: identityProviderMetadataURL,
          },
          providerType: 'SAML',
          attributeMapping: {
            'email':
              'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
            'email_verified':
              'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/email_verified',
            'family_name':
              'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname',
            'given_name':
              'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname',
            'name':
              'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
            'username':
              'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
            'preferredUsername':
              'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
          },
          userPoolId: userPool.userPoolId,
        },
      ).providerName
      : undefined;

    if (idpName) {
      userPool.registerIdentityProvider(
        cognito.UserPoolIdentityProvider.fromProviderName(
          this,
          'CognitoIdPAzureAD',
          idpName,
        ),
      );
      cognito.UserPoolClientIdentityProvider.custom(idpName);
    }

    const client = new cognito.UserPoolClient(this, 'CognitoAppClient', {
      userPool: userPool,
      userPoolClientName: `${environment}-theater-schedule-book`,
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
    });

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
        identityPoolName: `${environment} Azure AD`,
      },
    );

    const unauthenticatedRole = new iam.Role(
      this,
      'CognitoDefaultUnauthenticatedRole',
      {
        roleName: `${environment}-console-unauth-role`,
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
        roleName: `${environment}-console-auth-role`,
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

    const functionName = 'theater-schedule-book';
    const functionLogs = new awslogs.LogGroup(this, 'LambdaFunctionLogGroup', {
      logGroupName: `/aws/lambda/${functionName}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      retention: awslogs.RetentionDays.ONE_DAY,
    });

    const roleName = `${functionName}-role`;

    const lambdaFunction = new lambdaNodeJs.NodejsFunction(this, 'LambdaFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: './lambda/index.ts',
      functionName,
      retryAttempts: 0,
      environment: {
        NODE_OPTIONS: '--enable-source-maps',
      },
      bundling: {
        minify: true,
        sourceMap: true,
        sourceMapMode: lambdaNodeJs.SourceMapMode.BOTH,
        sourcesContent: true,
        keepNames: true,
        commandHooks: {
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
        },
      },
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
      apiName: `AuthorizerExample Server Lambda WebSocket API (${environment})`,
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
      parameterName: `/${environment}/theater-schedule-book/CognitoDomainUrl`,
      stringValue: `https://${domain}.auth.${this.region}.amazoncognito.com`,
    });

    new ssm.StringParameter(this, 'CognitoAppClientIdl', {
      parameterName: `/${environment}/theater-schedule-book/CognitoAppClientId`,
      stringValue: client.userPoolClientId,
    });

  }
}
