import { ListingMcpOutputSchema } from "~/mcp/buyer/schema/ListingMcpOutputSchema";
import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";

export const resourceListingSchema: McpResourceDefinition.Definition = {
	name: "mcp-schema-listing",
	uri: McpSchema.withSchemaResourceUri("listing"),
	title: "Listing Output Schema",
	description:
		"Shared buyer listing output schema with field descriptions for model consumption.",
	mimeType: "application/json",
	read(uri) {
		const outputSchema = McpSchema.withJsonSchema(ListingMcpOutputSchema, "output");

		return McpResourceDefinition.withContent(uri, {
			canonicalUri: uri.toString(),
			name: "listing",
			title: "Listing Output Schema",
			description:
				"Shared schema for a single buyer-visible listing returned by MCP listing tools. Date fields are ISO 8601 strings.",
			outputSchema,
			outputSummary: McpSchema.withSummary(outputSchema),
			entityResourceUris: [
				McpSchema.withEntityResourceUri("listing"),
				McpSchema.withEntityResourceUri("gallery"),
				McpSchema.withEntityResourceUri("category"),
				McpSchema.withEntityResourceUri("location"),
			],
			enumResourceUris: [
				McpSchema.withEnumResourceUri("listing-restriction"),
				McpSchema.withEnumResourceUri("listing-price"),
				McpSchema.withEnumResourceUri("currency"),
				McpSchema.withEnumResourceUri("listing-warranty"),
				McpSchema.withEnumResourceUri("listing-delivery"),
				McpSchema.withEnumResourceUri("thumb"),
			],
			guideResourceUris: [
				McpSchema.withGuideResourceUri("listing-behavior"),
				McpSchema.withGuideResourceUri("search-and-ranking"),
				McpSchema.withGuideResourceUri("failures"),
			],
			fieldResourceUris: [
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
			],
			responseInterpretationHints: [
				"Prefer expanded linked objects such as location, category, and gallery when explaining a result to a user.",
				"delivery is a normalized array of marketplace delivery buckets, not free-form seller prose.",
				"locationId, categoryId, and galleryId are stable identifiers; location, category, and gallery provide human-readable expanded context.",
				"distance is meaningful only for geo-aware queries that include meta.latLon; otherwise it may be null.",
				"my, isFavourite, isIgnored, hasFlag, transactionId, and thumb are actor-relative fields tied to the authenticated buyer context.",
			],
		});
	},
};
