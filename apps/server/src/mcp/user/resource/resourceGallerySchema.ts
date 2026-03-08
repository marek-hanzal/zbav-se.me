import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";
import { GalleryMcpOutputSchema } from "~/mcp/user/schema/GalleryMcpOutputSchema";

export const resourceGallerySchema: McpResourceDefinition.Definition = {
	name: "mcp-schema-gallery",
	uri: McpSchema.withSchemaResourceUri("gallery"),
	title: "Gallery Output Schema",
	description: "Shared gallery output schema used by draft and listing write flows.",
	mimeType: "application/json",
	read(uri) {
		const outputSchema = McpSchema.withJsonSchema(GalleryMcpOutputSchema, "output");

		return McpResourceDefinition.withContent(uri, {
			canonicalUri: uri.toString(),
			name: "gallery",
			title: "Gallery Output Schema",
			description: "Shared schema for one gallery with ordered upload-backed items.",
			outputSchema,
			outputSummary: McpSchema.withSummary(outputSchema),
			guideResourceUris: [
				McpSchema.withGuideResourceUri("draft-write-flow"),
			],
			entityResourceUris: [
				McpSchema.withEntityResourceUri("gallery"),
			],
			fieldResourceUris: [
				McpSchema.withFieldResourceUri("draft.gallery"),
				McpSchema.withFieldResourceUri("upload.id"),
				McpSchema.withFieldResourceUri("upload.url"),
			],
			responseInterpretationHints: [
				"Gallery items are ordered by sort and should be presented in that order.",
				"Each gallery item points to an upload-backed image that was already registered in application metadata.",
			],
		});
	},
};
