import { DraftMcpOutputSchema } from "~/mcp/seller/schema/DraftMcpOutputSchema";
import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";

export const resourceDraftSchema: McpResourceDefinition.Definition = {
	name: "mcp-schema-draft",
	uri: McpSchema.withSchemaResourceUri("draft"),
	title: "Draft Output Schema",
	description: "Shared seller draft output schema with write-flow specific field meanings.",
	mimeType: "application/json",
	read(uri) {
		const outputSchema = McpSchema.withJsonSchema(DraftMcpOutputSchema, "output");

		return McpResourceDefinition.withContent(uri, {
			canonicalUri: uri.toString(),
			name: "draft",
			title: "Draft Output Schema",
			description:
				"Shared schema for one seller draft during create, patch, and publish preparation.",
			outputSchema,
			outputSummary: McpSchema.withSummary(outputSchema),
			guideResourceUris: [
				McpSchema.withGuideResourceUri("draft-write-flow"),
				McpSchema.withGuideResourceUri("failures"),
			],
			entityResourceUris: [
				McpSchema.withEntityResourceUri("draft"),
				McpSchema.withEntityResourceUri("gallery"),
			],
			fieldResourceUris: [
				McpSchema.withFieldResourceUri("draft.id"),
				McpSchema.withFieldResourceUri("draft.title"),
				McpSchema.withFieldResourceUri("draft.description"),
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
				McpSchema.withFieldResourceUri("draft.pros"),
				McpSchema.withFieldResourceUri("draft.cons"),
				McpSchema.withFieldResourceUri("draft.gallery"),
				McpSchema.withFieldResourceUri("draft.usedAt"),
			],
			responseInterpretationHints: [
				"Preserve draft.id; it is the stable handle for later patch, gallery, and publish steps.",
				"usedAt becomes non-null after successful publish from the draft and means the draft was already consumed.",
				"gallery always exists for a draft, even when it currently has no items.",
			],
		});
	},
};
