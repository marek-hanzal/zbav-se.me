import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { listingCountFx } from "~/@seller/listing/fx/listingCountFx";
import { ListingCountQuerySchema } from "~/@seller/listing/schema/ListingCountQuerySchema";
import { CountSchema } from "~/schema/CountSchema";
import { McpSchema } from "~/mcp/McpSchema";
import type { McpToolDefinition } from "~/mcp/McpToolDefinition";
import { CountMcpOutputSchema } from "~/mcp/schema/CountMcpOutputSchema";
import { SellerListingCountQueryMcpSchema } from "~/mcp/seller/schema/SellerListingCountQueryMcpSchema";

const examples: McpToolDefinition.Example<SellerListingCountQueryMcpSchema.Type>[] = [
	{
		title: "Count all published seller listings",
		description:
			"Use an empty query when you only need the seller's total published listing count.",
		arguments: {},
	},
	{
		title: "Count published listings matching text",
		description: "Use fulltext when you want the count for one seller-side text slice.",
		arguments: {
			filter: {
				fulltext: "chléb",
			},
		},
	},
];

export const toolSellerListingCount: McpToolDefinition.Definition<
	SellerListingCountQueryMcpSchema,
	CountMcpOutputSchema
> = {
	name: "listingCount",
	namespace: "seller",
	title: "Seller Listing Count",
	description:
		"Seller-side read tool for counting seller-owned published listings. Use this when you need totals or filtered published-listing counts without loading full listing payloads. Prefer public filter semantics. See: zbav://mcp/guide/overview, zbav://mcp/guide/roles, zbav://mcp/guide/failures, zbav://mcp/guide/namespaces, and zbav://mcp/entity/listing.",
	role: "seller",
	workflowHint:
		"Use to check published listing volume before browsing full listing collections or deciding whether publish already happened.",
	guideResourceUris: [
		McpSchema.withGuideResourceUri("overview"),
		McpSchema.withGuideResourceUri("roles"),
		McpSchema.withGuideResourceUri("failures"),
		McpSchema.withGuideResourceUri("namespaces"),
	],
	profileResourceUris: [
		McpSchema.withProfileResourceUri("seller.listing.countPublished"),
	],
	entityResourceUris: [
		McpSchema.withEntityResourceUri("listing"),
	],
	fieldResourceUris: [
		McpSchema.withFieldResourceUri("filter.id"),
		McpSchema.withFieldResourceUri("filter.idIn"),
		McpSchema.withFieldResourceUri("filter.fulltext"),
		McpSchema.withFieldResourceUri("count.total"),
		McpSchema.withFieldResourceUri("count.filter"),
		McpSchema.withFieldResourceUri("count.isEmpty"),
		McpSchema.withFieldResourceUri("count.isFilterEmpty"),
	],
	annotations: {
		title: "Seller Listing Count",
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
	},
	inputSchema: SellerListingCountQueryMcpSchema,
	outputSchema: CountMcpOutputSchema,
	examples,
	execute(args, context) {
		const query = ListingCountQuerySchema.parse(args);

		return listingCountFx({
			...query,
			scope: {
				userId: context.userId,
			},
		}).pipe(
			Effect.andThen((data) =>
				zodGuardFx({
					schema: CountSchema,
					dataFx: Effect.succeed(data),
				}),
			),
			Effect.andThen((data) =>
				zodGuardFx({
					schema: CountMcpOutputSchema,
					dataFx: Effect.succeed(data),
				}),
			),
		);
	},
};
