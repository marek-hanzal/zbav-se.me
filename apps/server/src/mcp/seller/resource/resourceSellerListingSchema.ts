import { SellerListingMcpOutputSchema } from "~/mcp/seller/schema/SellerListingMcpOutputSchema";
import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";

export const resourceSellerListingSchema: McpResourceDefinition.Definition = {
	name: "mcp-schema-seller-listing",
	uri: McpSchema.withSchemaResourceUri("seller.listing"),
	title: "Seller Listing Output Schema",
	description: "Shared seller publish output schema returned after listing creation.",
	mimeType: "application/json",
	read(uri) {
		const outputSchema = McpSchema.withJsonSchema(SellerListingMcpOutputSchema, "output");

		return McpResourceDefinition.withContent(uri, {
			canonicalUri: uri.toString(),
			name: "seller.listing",
			title: "Seller Listing Output Schema",
			description:
				"Shared schema for one published seller listing returned by publish flows.",
			outputSchema,
			outputSummary: McpSchema.withSummary(outputSchema),
			guideResourceUris: [
				McpSchema.withGuideResourceUri("draft-write-flow"),
			],
			entityResourceUris: [
				McpSchema.withEntityResourceUri("listing"),
				McpSchema.withEntityResourceUri("gallery"),
			],
			fieldResourceUris: [
				McpSchema.withFieldResourceUri("listing.priceType"),
				McpSchema.withFieldResourceUri("listing.condition"),
				McpSchema.withFieldResourceUri("listing.age"),
				McpSchema.withFieldResourceUri("listing.delivery"),
				McpSchema.withFieldResourceUri("listing.restriction"),
				McpSchema.withFieldResourceUri("listing.location"),
				McpSchema.withFieldResourceUri("listing.category"),
				McpSchema.withFieldResourceUri("listing.gallery"),
				McpSchema.withFieldResourceUri("listing.draftId"),
			],
			responseInterpretationHints: [
				"A successful result means the public listing already exists and the gallery is attached.",
				"draftId links back to the source draft when the listing was published from one.",
			],
		});
	},
};
