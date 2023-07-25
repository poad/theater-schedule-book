import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: '../schema.gql',
  documents: 'src/**/*.{ts,tsx}',
  generates: {
    './src/app/gql/': {
      preset: 'client',
      config: {
        useIndexSignature: true,
        strictScalars: true,
        scalars: {
          DateTime: 'string',
          Date: 'string',
          URL: 'string',
        },
      },
    },
    './graphql.schema.json': {
      plugins: ['introspection', 'jsdoc'],
    },
  },
};

export default config;
