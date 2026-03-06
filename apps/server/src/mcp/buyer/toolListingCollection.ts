import { z } from "@hono/zod-openapi";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { listingCollectionFx } from "~/@buyer/listing/fx/listingCollectionFx";
import { ListingQuerySchema } from "~/@buyer/listing/schema/ListingQuerySchema";
import { ListingSchema } from "~/@buyer/listing/schema/ListingSchema";
import type { McpToolDefinition } from "~/mcp/McpToolDefinition";

const ListingCollectionSchema = z
	.array(ListingSchema)
	.describe("Array of buyer-visible listings returned for the provided search query.");

type ListingCollectionSchema = typeof ListingCollectionSchema;

const examples: McpToolDefinition.Example<ListingQuerySchema.Type>[] = [
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
	ListingQuerySchema,
	ListingCollectionSchema
> = {
	name: "listingCollection",
	namespace: "buyer",
	title: "Buyer Listing Collection",
	description:
		"Fetch a buyer-visible collection of listings using the authenticated buyer context. Use this for browsing, search, pagination, filtering, and sorting across many listings.",
	annotations: {
		title: "Buyer Listing Collection",
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
	},
	inputSchema: ListingQuerySchema.describe(
		"Buyer listing collection query. Supports pagination, fulltext, filters, sort, and optional meta such as lat/lon for distance-aware results.",
	),
	outputSchema: ListingCollectionSchema,
	examples,
	execute(args, context) {
		return listingCollectionFx({
			...args,
			userId: context.userId,
			scope: {},
		}).pipe(
			Effect.andThen((data) =>
				zodGuardFx({
					schema: ListingCollectionSchema,
					dataFx: Effect.succeed(data),
				}),
			),
		);
	},
};
