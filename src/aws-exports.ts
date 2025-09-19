const awsconfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-west-2_IG3iI4fQ2',
      userPoolClientId: '5tmh7vou7gqrtlkusb339gj828',
      identityPoolId: 'us-west-2:d595bc39-3687-41c2-a26b-063da8b22463',
      loginWith: {
        email: true,
      },
    },
  },
  API: {
    GraphQL: {
      endpoint: 'https://7yyqg6vivracxknmdq2tqjh3ce.appsync-api.us-west-2.amazonaws.com/graphql',
      region: 'us-west-2',
      defaultAuthMode: 'userPool',
    },
  },
} as const;

export default awsconfig;
