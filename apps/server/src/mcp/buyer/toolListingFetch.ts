import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { listingFetchFx } from "~/@buyer/listing/fx/listingFetchFx";
import { ListingQuerySchema } from "~/@buyer/listing/schema/ListingQuerySchema";
import { ListingSchema } from "~/@buyer/listing/schema/ListingSchema";
import type { McpToolDefinition } from "~/mcp/McpToolDefinition";

const examples: McpToolDefinition.Example<ListingQuerySchema.Type>[] = [
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
	ListingQuerySchema,
	ListingSchema
> = {
	name: "listingFetch",
	namespace: "buyer",
	title: "Buyer Listing Fetch",
	description:
		"Fetch one buyer-visible listing using the authenticated buyer context. Use this when you need a single concrete listing that matches a focused query, such as an exact listing id or a tightly constrained search.",
	annotations: {
		title: "Buyer Listing Fetch",
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
	},
	inputSchema: ListingQuerySchema.describe(
		"Buyer listing query. Accepts exact ids, fulltext, filters, sort, and optional meta such as geolocation.",
	),
	outputSchema: ListingSchema.describe(
		"One buyer-visible listing enriched with category, gallery, location, and user-specific flags.",
	),
	examples,
	execute(args, context) {
		return listingFetchFx({
			...args,
			userId: context.userId,
			scope: {},
		}).pipe(
			Effect.andThen((data) =>
				zodGuardFx({
					schema: ListingSchema,
					dataFx: Effect.succeed(data),
				}),
			),
		);
	},
};
