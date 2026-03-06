import { UploadMcpOutputSchema } from "~/mcp/user/schema/UploadMcpOutputSchema";
import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";

export const resourceUploadSchema: McpResourceDefinition.Definition = {
	name: "mcp-schema-upload",
	uri: McpSchema.withSchemaResourceUri("upload"),
	title: "Upload Output Schema",
	description: "Shared upload output schema used by seller image and gallery write flows.",
	mimeType: "application/json",
	read(uri) {
		const outputSchema = McpSchema.withJsonSchema(UploadMcpOutputSchema, "output");

		return McpResourceDefinition.withContent(uri, {
			canonicalUri: uri.toString(),
			name: "upload",
			title: "Upload Output Schema",
			description: "Shared schema for one registered upload item.",
			outputSchema,
			outputSummary: McpSchema.withSummary(outputSchema),
			guideResourceUris: [
				McpSchema.withGuideResourceUri("draft-write-flow"),
			],
			entityResourceUris: [
				McpSchema.withEntityResourceUri("upload"),
			],
			fieldResourceUris: [
				McpSchema.withFieldResourceUri("upload.id"),
				McpSchema.withFieldResourceUri("upload.url"),
			],
			responseInterpretationHints: [
				"Preserve upload.id and reuse it in draft gallery or listing publish steps.",
				"upload.url is the accepted CDN URL; it is not the pre-signed PUT URL.",
			],
		});
	},
};
