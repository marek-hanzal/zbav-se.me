import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { listingFetchFx } from "~/@buyer/listing/fx/listingFetchFx";
import { ListingQuerySchema } from "~/@buyer/listing/schema/ListingQuerySchema";
import { ListingSchema } from "~/@buyer/listing/schema/ListingSchema";
import {
	ListingMcpOutputSchema,
	withListingMcpOutput,
} from "~/mcp/buyer/schema/ListingMcpOutputSchema";
import { ListingQueryMcpSchema } from "~/mcp/buyer/schema/ListingQueryMcpSchema";
import { McpSchema } from "~/mcp/McpSchema";
import type { McpToolDefinition } from "~/mcp/McpToolDefinition";

const examples: McpToolDefinition.Example<ListingQueryMcpSchema.Type>[] = [
	{
		title: "Fetch by exact listing id",
		description:
			"Use the exact listing id when you already know the listing you want to inspect.",
		arguments: {
			filter: {
				id: "listing_123",
			},
		},
	},
	{
		title: "Fetch first newest listing from a text query",
		description:
			"Use fulltext with sorting when you want one representative listing for a buyer-facing search.",
		arguments: {
			filter: {
				fulltext: "mountain bike",
			},
			sort: [
				{
					field: "createdAt",
					order: "desc",
				},
			],
		},
	},
];

export const toolListingFetch: McpToolDefinition.Definition<
	ListingQueryMcpSchema,
	ListingMcpOutputSchema
> = {
	name: "listingFetch",
	namespace: "buyer",
	title: "Buyer Listing Fetch",
	description:
		"Buyer-side tool for inspecting one published listing in shopping context. Use this when you need a single concrete listing that matches a focused query, such as an exact listing id or a tightly constrained search. The public MCP contract prefers filter for constraints. See: zbav://mcp/guide/overview, zbav://mcp/guide/rules, zbav://mcp/guide/roles, zbav://mcp/guide/listing-behavior, zbav://mcp/guide/search-and-ranking, zbav://mcp/guide/query-profiles, zbav://mcp/guide/failures, and zbav://mcp/entity/listing.",
	role: "buyer",
	workflowHint: "Use for buyer-side detail inspection of one published listing.",
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
		McpSchema.withFieldResourceUri("filter.fulltext"),
		McpSchema.withFieldResourceUri("filter.priceMin"),
		McpSchema.withFieldResourceUri("filter.priceMax"),
		McpSchema.withFieldResourceUri("filter.deliveryIn"),
		McpSchema.withFieldResourceUri("filter.categoryIdIn"),
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
		McpSchema.withFieldResourceUri("meta.latLon"),
		McpSchema.withFieldResourceUri("sort.field"),
		McpSchema.withFieldResourceUri("sort.order"),
	],
	annotations: {
		title: "Buyer Listing Fetch",
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
	},
	inputSchema: ListingQueryMcpSchema.describe(
		"Buyer listing query. Accepts exact ids, fulltext, filters, sort, and optional meta such as geolocation.",
	),
	outputSchema: ListingMcpOutputSchema,
	examples,
	execute(args, context) {
		const query = ListingQuerySchema.parse(args);

		return listingFetchFx({
			...query,
			userId: context.userId,
			scope: {},
		}).pipe(
			Effect.andThen((data) =>
				zodGuardFx({
					schema: ListingSchema,
					dataFx: Effect.succeed(data),
				}),
			),
			Effect.map(withListingMcpOutput),
			Effect.andThen((data) =>
				zodGuardFx({
					schema: ListingMcpOutputSchema,
					dataFx: Effect.succeed(data),
				}),
			),
		);
	},
};
