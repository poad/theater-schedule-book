import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: '../schema.gql',

  generates: {
    './lambda/types/generated/graphql.ts': {
      config: {
        useIndexSignature: true,
        strictScalars: true,
        scalars: {
          DateTime: 'string',
          Date: 'string',
          URL: 'string',
        },
      },
      plugins: ['typescript', 'typescript-resolvers', 'typescript-validation-schema'],
    },
    './graphql.schema.json': {
      plugins: ['introspection', 'jsdoc'],
    },
  },
};

export default config;
