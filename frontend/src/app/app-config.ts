const appConfig = {
  identityProviderName: 'AzureAD',
  auth: {
    identityPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_ID_POOL_ID,
    region: 'us-west-2',
    identityPoolRegion: 'us-west-2',
    userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID,
    userPoolWebClientId: process.env.NEXT_PUBLIC_AWS_WEB_CLIENT_ID,

    // storage: MyStorage,

    oauth: {
      domain: process.env.NEXT_PUBLIC_AWS_COGNITO_OAUTH_DOMAIN,
      scope: ['email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
      redirectSignIn: process.env.NEXT_PUBLIC_AWS_COGNITO_OAUTH_REDIRECT_SIGNIN,
      redirectSignOut:
        process.env.NEXT_PUBLIC_AWS_COGNITO_OAUTH_REDIRECT_SIGNOUT,
      responseType: 'code',
    },
  },
};

export default appConfig;
