import { CategoryMcpOutputSchema } from "~/mcp/session/schema/CategoryMcpOutputSchema";
import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";

export const resourceCategorySchema: McpResourceDefinition.Definition = {
	name: "mcp-schema-category",
	uri: McpSchema.withSchemaResourceUri("category"),
	title: "Category Output Schema",
	description: "Shared category output schema with field descriptions for seller write flows.",
	mimeType: "application/json",
	read(uri) {
		const outputSchema = McpSchema.withJsonSchema(CategoryMcpOutputSchema, "output");

		return McpResourceDefinition.withContent(uri, {
			canonicalUri: uri.toString(),
			name: "category",
			title: "Category Output Schema",
			description:
				"Shared schema for one category option returned by MCP category selection tools.",
			outputSchema,
			outputSummary: McpSchema.withSummary(outputSchema),
			guideResourceUris: [
				McpSchema.withGuideResourceUri("draft-write-flow"),
			],
			entityResourceUris: [
				McpSchema.withEntityResourceUri("category"),
			],
			fieldResourceUris: [
				McpSchema.withFieldResourceUri("category.id"),
				McpSchema.withFieldResourceUri("category.group"),
				McpSchema.withFieldResourceUri("category.category"),
				McpSchema.withFieldResourceUri("category.slug"),
				McpSchema.withFieldResourceUri("category.locale"),
			],
			responseInterpretationHints: [
				"Use id as the stable categoryId for draft and publish calls.",
				"Use category as the best human-facing label, with group as extra context when several categories sound similar.",
				"Slug is machine-friendly and stable, but id remains the canonical write-flow identifier.",
			],
		});
	},
};
