/**
 * Compile-time contract checks for the Resource collection.
 * Kept in the lib TypeScript project so `yarn compile:lib` fails if OpenAPI drifts.
 */
import type { components, operations } from "./gen/types";

type Expect<T extends true> = T;
type IsExact<A, B> = (<T>() => T extends A ? 1 : 2) extends <
  T,
>() => T extends B ? 1 : 2
  ? true
  : false;
type HasRequiredKey<T, K extends PropertyKey> = K extends keyof T
  ? undefined extends T[K]
    ? false
    : true
  : false;
type LacksKey<T, K extends PropertyKey> = K extends keyof T ? false : true;

type ResourceRequestData = components["schemas"]["ResourceRequest"]["data"];
type Resource = components["schemas"]["Resource"];
type ResourceBlocks = NonNullable<Resource["blocks"]>[number];
type GetResourcesQuery = NonNullable<
  operations["get/resources"]["parameters"]["query"]
>;

// Mutation schema matches content type (not ArticleRequest)
type _requestRequired = Expect<
  HasRequiredKey<ResourceRequestData, "title"> &
    HasRequiredKey<ResourceRequestData, "description"> &
    HasRequiredKey<ResourceRequestData, "slug"> &
    HasRequiredKey<ResourceRequestData, "campaign"> &
    HasRequiredKey<ResourceRequestData, "publishDateVisible">
>;
type _requestExcludesArticleFields = Expect<
  LacksKey<ResourceRequestData, "featured"> &
    LacksKey<ResourceRequestData, "categories"> &
    LacksKey<ResourceRequestData, "authorsBio"> &
    LacksKey<ResourceRequestData, "tags">
>;

// Response requiredness
type _responseRequired = Expect<
  HasRequiredKey<Resource, "title"> &
    HasRequiredKey<Resource, "description"> &
    HasRequiredKey<Resource, "slug"> &
    HasRequiredKey<Resource, "campaign"> &
    HasRequiredKey<Resource, "publishDateVisible">
>;

// v1 blocks are rich-text only
type _blocksRichTextOnly = Expect<
  IsExact<ResourceBlocks, components["schemas"]["SharedRichTextComponent"]>
>;

// cow.fi getAllResourceSlugs query: fields: ['slug', 'campaign']
type _fieldsIsStringArray = Expect<
  IsExact<GetResourcesQuery["fields"], string[] | undefined>
>;

const _slugQueryAccepted: GetResourcesQuery = {
  fields: ["slug", "campaign"],
};

void _slugQueryAccepted;
void (null as unknown as _requestRequired);
void (null as unknown as _requestExcludesArticleFields);
void (null as unknown as _responseRequired);
void (null as unknown as _blocksRichTextOnly);
void (null as unknown as _fieldsIsStringArray);
