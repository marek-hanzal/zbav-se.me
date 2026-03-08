import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";
import { resourceCategorySchema } from "~/mcp/session/resource/resourceCategorySchema";
import { toolCategoryCollection } from "~/mcp/session/tool/category-collection/toolCategoryCollection";

export const resourceSessionCategoryCollectionOutputSchema: McpResourceDefinition.Definition = {
	name: "mcp-schema-session-category-collection",
	uri: McpSchema.withSchemaResourceUri("session.categoryCollection"),
	title: "session.categoryCollection Output Schema",
	description: "Output schema resource for the session.categoryCollection MCP tool.",
	mimeType: "application/json",
	read(uri) {
		const outputSchema = McpSchema.withJsonSchema(
			toolCategoryCollection.outputSchema,
			"output",
		);
		const itemFieldResourceUris = toolCategoryCollection.fieldResourceUris.filter((fieldUri) =>
			fieldUri.startsWith(McpSchema.withFieldResourceUri("category.")),
		);

		return McpResourceDefinition.withContent(uri, {
			canonicalUri: uri.toString(),
			name: "session.categoryCollection",
			title: toolCategoryCollection.title,
			description: toolCategoryCollection.description,
			outputSchema,
			outputSummary: McpSchema.withSummary(outputSchema),
			guideResourceUris: toolCategoryCollection.guideResourceUris,
			profileResourceUris: toolCategoryCollection.profileResourceUris,
			entityResourceUris: toolCategoryCollection.entityResourceUris,
			fieldResourceUris: toolCategoryCollection.fieldResourceUris,
			itemFieldResourceUris,
			itemOutputSchema:
				outputSchema.type === "array" &&
				outputSchema.items &&
				typeof outputSchema.items === "object" &&
				!Array.isArray(outputSchema.items)
					? outputSchema.items
					: undefined,
			itemOutputSummary:
				outputSchema.type === "array" &&
				outputSchema.items &&
				typeof outputSchema.items === "object" &&
				!Array.isArray(outputSchema.items)
					? McpSchema.withSummary(outputSchema.items)
					: undefined,
			responseInterpretationHints: [
				"Use the returned category id as the canonical categoryId for seller draft and publish calls.",
				"Prefer category for user-facing wording and group for disambiguation.",
			],
			itemSchemaUri: resourceCategorySchema.uri,
			relatedSchemas: [
				resourceCategorySchema.uri,
			],
		});
	},
};
