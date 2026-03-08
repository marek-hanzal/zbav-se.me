import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";
import { toolS3PreSign } from "~/mcp/user/tool/s3-presign/toolS3PreSign";

export const resourceUserS3PreSignOutputSchema: McpResourceDefinition.Definition = {
	name: "mcp-schema-user-s3-presign",
	uri: McpSchema.withSchemaResourceUri("user.s3PreSign"),
	title: "user.s3PreSign Output Schema",
	description: "Output schema resource for the user.s3PreSign MCP tool.",
	mimeType: "application/json",
	read(uri) {
		const outputSchema = McpSchema.withJsonSchema(toolS3PreSign.outputSchema, "output");

		return McpResourceDefinition.withContent(uri, {
			canonicalUri: uri.toString(),
			name: "user.s3PreSign",
			title: toolS3PreSign.title,
			description: toolS3PreSign.description,
			outputSchema,
			outputSummary: McpSchema.withSummary(outputSchema),
			guideResourceUris: toolS3PreSign.guideResourceUris,
			profileResourceUris: toolS3PreSign.profileResourceUris,
			entityResourceUris: toolS3PreSign.entityResourceUris,
			fieldResourceUris: toolS3PreSign.fieldResourceUris,
			responseInterpretationHints: [
				"url is the short-lived PUT target for raw bytes and should not be stored as final media metadata.",
				"cdn is the value to pass into user.uploadCreate after the external upload succeeds.",
			],
		});
	},
};
