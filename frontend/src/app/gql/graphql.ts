/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Date: { input: string; output: string };
  DateTime: { input: string; output: string };
  URL: { input: string; output: string };
};

export type Cast = Node & {
  __typename?: 'Cast';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  roleName: Scalars['String']['output'];
};

export type CastInput = {
  name: Scalars['String']['input'];
  roleName: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  putTitle: Title;
};

export type MutationPutTitleArgs = {
  title: TitleInput;
};

export type Node = {
  id: Scalars['ID']['output'];
};

/** The query root of GraphQL interface. */
export type Query = {
  __typename?: 'Query';
  theaters: Array<Scalars['String']['output']>;
  titles: Array<Title>;
};

export type Show = Node & {
  __typename?: 'Show';
  casts?: Maybe<Array<Cast>>;
  id: Scalars['ID']['output'];
  showDate: Scalars['DateTime']['output'];
  theater: Scalars['String']['output'];
};

export type ShowInput = {
  casts?: InputMaybe<Array<CastInput>>;
  showDate: Scalars['DateTime']['input'];
  theater: Scalars['String']['input'];
};

export type Title = Node & {
  __typename?: 'Title';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  shows?: Maybe<Array<Show>>;
  url: Scalars['URL']['output'];
};

export type TitleInput = {
  name: Scalars['String']['input'];
  shows?: InputMaybe<Array<ShowInput>>;
  url: Scalars['URL']['input'];
};

export type ListTitlesQueryVariables = Exact<{ [key: string]: never }>;

export type ListTitlesQuery = {
  __typename?: 'Query';
  titles: Array<{ __typename?: 'Title'; id: string }>;
};

export const ListTitlesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'ListTitles' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'titles' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ListTitlesQuery, ListTitlesQueryVariables>;
