import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ssm from 'aws-cdk-lib/aws-ssm';

interface BackendStackProps extends cdk.StackProps {
  environment: string;
  domain: string;
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
      },
    );

    unauthenticatedRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['cognito-sync:*', 'cognito-identity:*'],
        resources: ['*'],
      }),
    );
    unauthenticatedRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['sts:*'],
        resources: ['*'],
      }),
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
      },
    );
    authenticatedRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['cognito-sync:*', 'cognito-identity:*'],
        resources: ['*'],
      }),
    );
    authenticatedRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['sts:*'],
        resources: ['*'],
      }),
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
