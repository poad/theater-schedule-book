import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import * as yup from 'yup'
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: string; output: string; }
  DateTime: { input: string; output: string; }
  URL: { input: string; output: string; }
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

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;


/** Mapping of interface types */
export type ResolversInterfaceTypes<RefType extends Record<string, unknown>> = ResolversObject<{
  Node: ( Cast ) | ( Show ) | ( Title );
}>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Cast: ResolverTypeWrapper<Cast>;
  CastInput: CastInput;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Node: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Node']>;
  Query: ResolverTypeWrapper<{}>;
  Show: ResolverTypeWrapper<Show>;
  ShowInput: ShowInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Title: ResolverTypeWrapper<Title>;
  TitleInput: TitleInput;
  URL: ResolverTypeWrapper<Scalars['URL']['output']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  Cast: Cast;
  CastInput: CastInput;
  Date: Scalars['Date']['output'];
  DateTime: Scalars['DateTime']['output'];
  ID: Scalars['ID']['output'];
  Mutation: {};
  Node: ResolversInterfaceTypes<ResolversParentTypes>['Node'];
  Query: {};
  Show: Show;
  ShowInput: ShowInput;
  String: Scalars['String']['output'];
  Title: Title;
  TitleInput: TitleInput;
  URL: Scalars['URL']['output'];
}>;

export type CastResolvers<ContextType = any, ParentType extends ResolversParentTypes['Cast'] = ResolversParentTypes['Cast']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  roleName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  putTitle?: Resolver<ResolversTypes['Title'], ParentType, ContextType, RequireFields<MutationPutTitleArgs, 'title'>>;
}>;

export type NodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Cast' | 'Show' | 'Title', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  theaters?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  titles?: Resolver<Array<ResolversTypes['Title']>, ParentType, ContextType>;
}>;

export type ShowResolvers<ContextType = any, ParentType extends ResolversParentTypes['Show'] = ResolversParentTypes['Show']> = ResolversObject<{
  casts?: Resolver<Maybe<Array<ResolversTypes['Cast']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  showDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  theater?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TitleResolvers<ContextType = any, ParentType extends ResolversParentTypes['Title'] = ResolversParentTypes['Title']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  shows?: Resolver<Maybe<Array<ResolversTypes['Show']>>, ParentType, ContextType>;
  url?: Resolver<ResolversTypes['URL'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface UrlScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['URL'], any> {
  name: 'URL';
}

export type Resolvers<ContextType = any> = ResolversObject<{
  Cast?: CastResolvers<ContextType>;
  Date?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Node?: NodeResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Show?: ShowResolvers<ContextType>;
  Title?: TitleResolvers<ContextType>;
  URL?: GraphQLScalarType;
}>;




export function CastInputSchema(): yup.ObjectSchema<CastInput> {
  return yup.object({
    name: yup.string().defined().nonNullable(),
    roleName: yup.string().defined().nonNullable()
  })
}

export function ShowInputSchema(): yup.ObjectSchema<ShowInput> {
  return yup.object({
    casts: yup.array(yup.lazy(() => CastInputSchema().nonNullable())).defined().nullable().optional(),
    showDate: yup.string().defined().nonNullable(),
    theater: yup.string().defined().nonNullable()
  })
}

export function TitleInputSchema(): yup.ObjectSchema<TitleInput> {
  return yup.object({
    name: yup.string().defined().nonNullable(),
    shows: yup.array(yup.lazy(() => ShowInputSchema().nonNullable())).defined().nullable().optional(),
    url: yup.string().defined().nonNullable()
  })
}
