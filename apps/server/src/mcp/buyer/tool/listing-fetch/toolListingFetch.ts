import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { listingFetchFx } from "~/@buyer/listing/fx/listingFetchFx";
import { ListingQuerySchema } from "~/@buyer/listing/schema/ListingQuerySchema";
import { ListingSchema } from "~/@buyer/listing/schema/ListingSchema";
import {
	ListingMcpOutputSchema,
	withListingMcpOutput,
} from "~/mcp/buyer/schema/ListingMcpOutputSchema";
import { McpSchema } from "~/mcp/McpSchema";
import { ListingQueryMcpSchema } from "~/mcp/buyer/schema/ListingQueryMcpSchema";
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
		"Buyer-side tool for inspecting one published listing in shopping context. Use this when you need a single concrete listing that matches a focused query, such as an exact listing id or a tightly constrained search. The public MCP contract prefers filter for constraints. See: zbav://mcp/guide/overview, zbav://mcp/guide/rules, zbav://mcp/guide/roles, zbav://mcp/guide/listing-behavior, zbav://mcp/guide/search-and-ranking, and zbav://mcp/entity/listing.",
	role: "buyer",
	workflowHint: "Use for buyer-side detail inspection of one published listing.",
	guideResourceUris: [
		McpSchema.withGuideResourceUri("overview"),
		McpSchema.withGuideResourceUri("rules"),
		McpSchema.withGuideResourceUri("roles"),
		McpSchema.withGuideResourceUri("listing-behavior"),
		McpSchema.withGuideResourceUri("search-and-ranking"),
	],
	entityResourceUris: [
		McpSchema.withEntityResourceUri("listing"),
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
