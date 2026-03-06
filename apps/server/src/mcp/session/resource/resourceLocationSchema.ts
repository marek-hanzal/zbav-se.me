import { LocationMcpOutputSchema } from "~/mcp/session/schema/LocationMcpOutputSchema";
import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";

export const resourceLocationSchema: McpResourceDefinition.Definition = {
	name: "mcp-schema-location",
	uri: McpSchema.withSchemaResourceUri("location"),
	title: "Location Output Schema",
	description:
		"Shared session location output schema with field descriptions for model consumption.",
	mimeType: "application/json",
	read(uri) {
		const outputSchema = McpSchema.withJsonSchema(LocationMcpOutputSchema, "output");

		return McpResourceDefinition.withContent(uri, {
			canonicalUri: uri.toString(),
			name: "location",
			title: "Location Output Schema",
			description:
				"Shared schema for one structured location suggestion returned by MCP location tools.",
			outputSchema,
			outputSummary: McpSchema.withSummary(outputSchema),
			entityResourceUris: [
				McpSchema.withEntityResourceUri("location"),
			],
			guideResourceUris: [
				McpSchema.withGuideResourceUri("overview"),
				McpSchema.withGuideResourceUri("failures"),
			],
			fieldResourceUris: [
				McpSchema.withFieldResourceUri("location.query"),
				McpSchema.withFieldResourceUri("location.lang"),
				McpSchema.withFieldResourceUri("location.address"),
				McpSchema.withFieldResourceUri("location.city"),
				McpSchema.withFieldResourceUri("location.street"),
				McpSchema.withFieldResourceUri("location.zip"),
				McpSchema.withFieldResourceUri("location.country"),
				McpSchema.withFieldResourceUri("location.code"),
				McpSchema.withFieldResourceUri("location.confidence"),
				McpSchema.withFieldResourceUri("location.lat"),
				McpSchema.withFieldResourceUri("location.lon"),
			],
			responseInterpretationHints: [
				"address is the best human-readable preview and should be preferred when presenting a suggestion to a user.",
				"confidence ranks how well the result matches the input text; higher is better.",
				"lat and lon are normalized coordinates that can be reused for later geo-aware listing queries.",
				"query and lang reflect the lookup context, not necessarily the actor's permanent locale.",
			],
		});
	},
};
