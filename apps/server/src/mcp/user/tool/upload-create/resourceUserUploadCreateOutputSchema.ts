import { resourceUploadSchema } from "~/mcp/user/resource/resourceUploadSchema";
import { toolUploadCreate } from "~/mcp/user/tool/upload-create/toolUploadCreate";
import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";

export const resourceUserUploadCreateOutputSchema: McpResourceDefinition.Definition = {
	name: "mcp-schema-user-upload-create",
	uri: McpSchema.withSchemaResourceUri("user.uploadCreate"),
	title: "user.uploadCreate Output Schema",
	description: "Output schema resource for the user.uploadCreate MCP tool.",
	mimeType: "application/json",
	read(uri) {
		const outputSchema = McpSchema.withJsonSchema(toolUploadCreate.outputSchema, "output");

		return McpResourceDefinition.withContent(uri, {
			canonicalUri: uri.toString(),
			name: "user.uploadCreate",
			title: toolUploadCreate.title,
			description: toolUploadCreate.description,
			outputSchema,
			outputSummary: McpSchema.withSummary(outputSchema),
			guideResourceUris: toolUploadCreate.guideResourceUris,
			profileResourceUris: toolUploadCreate.profileResourceUris,
			entityResourceUris: toolUploadCreate.entityResourceUris,
			fieldResourceUris: toolUploadCreate.fieldResourceUris,
			responseInterpretationHints: [
				"Preserve the returned upload id for draft gallery replacement or listing publish.",
				"This tool accepts the CDN URL, not the short-lived PUT URL.",
			],
			relatedSchemas: [
				resourceUploadSchema.uri,
			],
		});
	},
};
