import { z } from "@hono/zod-openapi";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { listingCollectionFx } from "~/@buyer/listing/fx/listingCollectionFx";
import { ListingQuerySchema } from "~/@buyer/listing/schema/ListingQuerySchema";
import { ListingSchema } from "~/@buyer/listing/schema/ListingSchema";
import {
	ListingMcpOutputSchema,
	withListingMcpOutput,
} from "~/mcp/buyer/schema/ListingMcpOutputSchema";
import { ListingQueryMcpSchema } from "~/mcp/buyer/schema/ListingQueryMcpSchema";
import { McpSchema } from "~/mcp/McpSchema";
import type { McpToolDefinition } from "~/mcp/McpToolDefinition";

const ListingCollectionSchema = z
	.array(ListingMcpOutputSchema)
	.describe("Array of buyer-visible listings returned for the provided search query.");

type ListingCollectionSchema = typeof ListingCollectionSchema;

const examples: McpToolDefinition.Example<ListingQueryMcpSchema.Type>[] = [
	{
		title: "Newest listings with pagination",
		description:
			"Use pagination plus createdAt sorting when you want the latest buyer-visible listings.",
		arguments: {
			cursor: {
				page: 0,
				size: 5,
			},
			sort: [
				{
					field: "createdAt",
					order: "desc",
				},
			],
		},
	},
	{
		title: "Nearby listings for a category",
		description:
			"Use category filtering together with buyer geolocation when you want nearby results in a specific category.",
		arguments: {
			cursor: {
				page: 0,
				size: 10,
			},
			filter: {
				categoryId: "category_bikes",
				range: 25,
			},
			meta: {
				latLon: {
					lat: 50.0755,
					lon: 14.4378,
				},
			},
			sort: [
				{
					field: "geo",
					order: "asc",
				},
			],
		},
	},
];

export const toolListingCollection: McpToolDefinition.Definition<
	ListingQueryMcpSchema,
	ListingCollectionSchema
> = {
	name: "listingCollection",
	namespace: "buyer",
	title: "Buyer Listing Collection",
	description:
		"Buyer-side tool for browsing, searching, paginating, and sorting published listings in shopping context. Use filter for public buyer-facing constraints, sort for ordering, and meta for geolocation context. See: zbav://mcp/guide/overview, zbav://mcp/guide/rules, zbav://mcp/guide/roles, zbav://mcp/guide/listing-behavior, zbav://mcp/guide/search-and-ranking, zbav://mcp/guide/query-profiles, zbav://mcp/guide/failures, and zbav://mcp/entity/listing.",
	role: "buyer",
	workflowHint:
		"Use for buyer-side browse, search, pagination, and sorting over published listings.",
	guideResourceUris: [
		McpSchema.withGuideResourceUri("overview"),
		McpSchema.withGuideResourceUri("rules"),
		McpSchema.withGuideResourceUri("roles"),
		McpSchema.withGuideResourceUri("listing-behavior"),
		McpSchema.withGuideResourceUri("search-and-ranking"),
		McpSchema.withGuideResourceUri("query-profiles"),
		McpSchema.withGuideResourceUri("failures"),
	],
	profileResourceUris: [
		McpSchema.withProfileResourceUri("buyer.search.byDelivery"),
		McpSchema.withProfileResourceUri("buyer.search.nearby"),
		McpSchema.withProfileResourceUri("buyer.search.mine"),
		McpSchema.withProfileResourceUri("buyer.search.byCategory"),
		McpSchema.withProfileResourceUri("buyer.search.favourites"),
	],
	entityResourceUris: [
		McpSchema.withEntityResourceUri("listing"),
	],
	fieldResourceUris: [
		McpSchema.withFieldResourceUri("cursor.page"),
		McpSchema.withFieldResourceUri("cursor.size"),
		McpSchema.withFieldResourceUri("filter.id"),
		McpSchema.withFieldResourceUri("filter.idIn"),
		McpSchema.withFieldResourceUri("filter.fulltext"),
		McpSchema.withFieldResourceUri("filter.userId"),
		McpSchema.withFieldResourceUri("filter.priceMin"),
		McpSchema.withFieldResourceUri("filter.priceMax"),
		McpSchema.withFieldResourceUri("filter.conditionMin"),
		McpSchema.withFieldResourceUri("filter.conditionMax"),
		McpSchema.withFieldResourceUri("filter.conditionIn"),
		McpSchema.withFieldResourceUri("filter.ageMin"),
		McpSchema.withFieldResourceUri("filter.ageMax"),
		McpSchema.withFieldResourceUri("filter.ageIn"),
		McpSchema.withFieldResourceUri("filter.deliveryIn"),
		McpSchema.withFieldResourceUri("filter.warrantyIn"),
		McpSchema.withFieldResourceUri("filter.categoryId"),
		McpSchema.withFieldResourceUri("filter.categoryIdIn"),
		McpSchema.withFieldResourceUri("filter.currency"),
		McpSchema.withFieldResourceUri("filter.currencyIn"),
		McpSchema.withFieldResourceUri("listing.my"),
		McpSchema.withFieldResourceUri("listing.distance"),
		McpSchema.withFieldResourceUri("listing.isFavourite"),
		McpSchema.withFieldResourceUri("listing.isIgnored"),
		McpSchema.withFieldResourceUri("listing.hasFlag"),
		McpSchema.withFieldResourceUri("listing.condition"),
		McpSchema.withFieldResourceUri("listing.age"),
		McpSchema.withFieldResourceUri("listing.priceType"),
		McpSchema.withFieldResourceUri("listing.warranty"),
		McpSchema.withFieldResourceUri("listing.restriction"),
		McpSchema.withFieldResourceUri("listing.transactionId"),
		McpSchema.withFieldResourceUri("listing.delivery"),
		McpSchema.withFieldResourceUri("listing.location"),
		McpSchema.withFieldResourceUri("listing.category"),
		McpSchema.withFieldResourceUri("listing.gallery"),
		McpSchema.withFieldResourceUri("listing.thumb"),
		McpSchema.withFieldResourceUri("listing.draftId"),
		McpSchema.withFieldResourceUri("filter.range"),
		McpSchema.withFieldResourceUri("filter.my"),
		McpSchema.withFieldResourceUri("filter.isFavourite"),
		McpSchema.withFieldResourceUri("filter.withOwn"),
		McpSchema.withFieldResourceUri("filter.withIgnored"),
		McpSchema.withFieldResourceUri("filter.feedId"),
		McpSchema.withFieldResourceUri("filter.feedIdIn"),
		McpSchema.withFieldResourceUri("filter.expiresAtBefore"),
		McpSchema.withFieldResourceUri("filter.expiresAtAfter"),
		McpSchema.withFieldResourceUri("filter.title"),
		McpSchema.withFieldResourceUri("filter.transaction"),
		McpSchema.withFieldResourceUri("meta.latLon"),
		McpSchema.withFieldResourceUri("meta.feedId"),
		McpSchema.withFieldResourceUri("sort.field"),
		McpSchema.withFieldResourceUri("sort.order"),
	],
	annotations: {
		title: "Buyer Listing Collection",
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
	},
	inputSchema: ListingQueryMcpSchema.describe(
		"Buyer listing collection query. Supports pagination, fulltext, filters, sort, and optional meta such as lat/lon for distance-aware results.",
	),
	outputSchema: ListingCollectionSchema,
	examples,
	execute(args, context) {
		const query = ListingQuerySchema.parse(args);

		return listingCollectionFx({
			...query,
			userId: context.userId,
			scope: {},
		}).pipe(
			Effect.andThen((data) =>
				zodGuardFx({
					schema: z.array(ListingSchema),
					dataFx: Effect.succeed(data),
				}),
			),
			Effect.map((data) => data.map(withListingMcpOutput)),
			Effect.andThen((data) =>
				zodGuardFx({
					schema: ListingCollectionSchema,
					dataFx: Effect.succeed(data),
				}),
			),
		);
	},
};
