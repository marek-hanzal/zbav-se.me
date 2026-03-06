import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { listingCreateFx } from "~/@seller/listing/fx/listingCreateFx";
import { ListingCreateSchema } from "~/@seller/listing/schema/ListingCreateSchema";
import { ListingSchema } from "~/@seller/listing/schema/ListingSchema";
import { withDateFx } from "~/database/fx/withDateFx";
import { McpSchema } from "~/mcp/McpSchema";
import type { McpToolDefinition } from "~/mcp/McpToolDefinition";
import { SellerListingCreateMcpSchema } from "~/mcp/seller/schema/SellerListingCreateMcpSchema";
import {
	SellerListingMcpOutputSchema,
	withSellerListingMcpOutput,
} from "~/mcp/seller/schema/SellerListingMcpOutputSchema";

const examples: McpToolDefinition.Example<SellerListingCreateMcpSchema.Type>[] = [
	{
		title: "Publish listing from an existing draft",
		description:
			"Use this after the draft already contains required fields and upload ids are ready for the final gallery.",
		arguments: {
			price: 1500,
			priceType: "closed",
			condition: 3,
			age: 2,
			delivery: [
				"post",
			],
			warranty: "no-warranty",
			restriction: "none",
			draftId: "draft_123",
			locationId: "location_prague",
			categoryId: "category_bikes",
			expiresAt: "14-days",
			title: "City bike in good condition",
			description: "Ready to ride. Stored indoors.",
			uploadIds: [
				"upload_cover",
				"upload_side",
			],
		},
	},
];

export const toolSellerListingCreate: McpToolDefinition.Definition<
	SellerListingCreateMcpSchema,
	SellerListingMcpOutputSchema
> = {
	name: "listingCreate",
	namespace: "seller",
	title: "Seller Listing Create",
	description:
		"Seller-side write tool for publishing a public listing, optionally from an existing draft. This is the publish step. Required fields must be complete and at least one upload id must be present. When draftId is provided, the draft is marked as used. See: zbav://mcp/guide/draft-write-flow, zbav://mcp/guide/failures, zbav://mcp/entity/listing, zbav://mcp/entity/draft, and zbav://mcp/entity/upload.",
	role: "seller",
	workflowHint:
		"Use when the draft is complete and you are ready to create the public listing. This is not a read preview; it performs the publish action.",
	guideResourceUris: [
		McpSchema.withGuideResourceUri("draft-write-flow"),
		McpSchema.withGuideResourceUri("failures"),
	],
	profileResourceUris: [
		McpSchema.withProfileResourceUri("seller.listing.publishFromDraft"),
	],
	entityResourceUris: [
		McpSchema.withEntityResourceUri("listing"),
		McpSchema.withEntityResourceUri("draft"),
		McpSchema.withEntityResourceUri("gallery"),
		McpSchema.withEntityResourceUri("upload"),
	],
	fieldResourceUris: [
		McpSchema.withFieldResourceUri("draft.id"),
		McpSchema.withFieldResourceUri("draft.price"),
		McpSchema.withFieldResourceUri("draft.priceType"),
		McpSchema.withFieldResourceUri("draft.condition"),
		McpSchema.withFieldResourceUri("draft.age"),
		McpSchema.withFieldResourceUri("draft.delivery"),
		McpSchema.withFieldResourceUri("draft.warranty"),
		McpSchema.withFieldResourceUri("draft.restriction"),
		McpSchema.withFieldResourceUri("draft.locationId"),
		McpSchema.withFieldResourceUri("draft.categoryId"),
		McpSchema.withFieldResourceUri("draft.expiresAt"),
		McpSchema.withFieldResourceUri("draft.title"),
		McpSchema.withFieldResourceUri("draft.description"),
		McpSchema.withFieldResourceUri("draft.pros"),
		McpSchema.withFieldResourceUri("draft.cons"),
		McpSchema.withFieldResourceUri("listing.uploadIds"),
		McpSchema.withFieldResourceUri("upload.id"),
		McpSchema.withFieldResourceUri("listing.draftId"),
	],
	annotations: {
		title: "Seller Listing Create",
		readOnlyHint: false,
		destructiveHint: true,
		idempotentHint: false,
	},
	inputSchema: SellerListingCreateMcpSchema,
	outputSchema: SellerListingMcpOutputSchema,
	examples,
	execute(args, context) {
		const input = ListingCreateSchema.parse(args);

		return listingCreateFx({
			...input,
			userId: context.userId,
		}).pipe(
			withDateFx,
			Effect.andThen((data) =>
				zodGuardFx({
					schema: ListingSchema,
					dataFx: Effect.succeed(data),
				}),
			),
			Effect.map(withSellerListingMcpOutput),
			Effect.andThen((data) =>
				zodGuardFx({
					schema: SellerListingMcpOutputSchema,
					dataFx: Effect.succeed(data),
				}),
			),
		);
	},
};
