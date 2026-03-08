import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";
import { resourceSellerListingSchema } from "~/mcp/seller/resource/resourceSellerListingSchema";
import { toolSellerListingCreate } from "~/mcp/seller/tool/listing-create/toolSellerListingCreate";

export const resourceSellerListingCreateOutputSchema: McpResourceDefinition.Definition = {
	name: "mcp-schema-seller-listing-create",
	uri: McpSchema.withSchemaResourceUri("seller.listingCreate"),
	title: "seller.listingCreate Output Schema",
	description: "Output schema resource for the seller.listingCreate MCP tool.",
	mimeType: "application/json",
	read(uri) {
		const outputSchema = McpSchema.withJsonSchema(
			toolSellerListingCreate.outputSchema,
			"output",
		);

		return McpResourceDefinition.withContent(uri, {
			canonicalUri: uri.toString(),
			name: "seller.listingCreate",
			title: toolSellerListingCreate.title,
			description: toolSellerListingCreate.description,
			outputSchema,
			outputSummary: McpSchema.withSummary(outputSchema),
			guideResourceUris: toolSellerListingCreate.guideResourceUris,
			profileResourceUris: toolSellerListingCreate.profileResourceUris,
			entityResourceUris: toolSellerListingCreate.entityResourceUris,
			fieldResourceUris: toolSellerListingCreate.fieldResourceUris,
			responseInterpretationHints: [
				"A successful result means the listing is already public and no longer just a draft artifact.",
				"When draftId is present, the source draft should now be considered consumed for publish purposes.",
			],
			relatedSchemas: [
				resourceSellerListingSchema.uri,
			],
		});
	},
};
