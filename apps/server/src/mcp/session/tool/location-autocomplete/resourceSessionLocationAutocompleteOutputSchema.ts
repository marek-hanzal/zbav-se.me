import { resourceLocationSchema } from "~/mcp/session/resource/resourceLocationSchema";
import { toolLocationAutocomplete } from "~/mcp/session/tool/location-autocomplete/toolLocationAutocomplete";
import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";

export const resourceSessionLocationAutocompleteOutputSchema: McpResourceDefinition.Definition = {
	name: "mcp-schema-session-location-autocomplete",
	uri: McpSchema.withSchemaResourceUri("session.locationAutocomplete"),
	title: "session.locationAutocomplete Output Schema",
	description: "Output schema resource for the session.locationAutocomplete MCP tool.",
	mimeType: "application/json",
	read(uri) {
		const outputSchema = McpSchema.withJsonSchema(
			toolLocationAutocomplete.outputSchema,
			"output",
		);
		const itemFieldResourceUris = toolLocationAutocomplete.fieldResourceUris.filter(
			(fieldUri) => fieldUri.startsWith(McpSchema.withFieldResourceUri("location.")),
		);

		return McpResourceDefinition.withContent(uri, {
			canonicalUri: uri.toString(),
			name: "session.locationAutocomplete",
			title: toolLocationAutocomplete.title,
			description: toolLocationAutocomplete.description,
			outputSchema,
			outputSummary: McpSchema.withSummary(outputSchema),
			guideResourceUris: toolLocationAutocomplete.guideResourceUris,
			profileResourceUris: toolLocationAutocomplete.profileResourceUris,
			entityResourceUris: toolLocationAutocomplete.entityResourceUris,
			fieldResourceUris: toolLocationAutocomplete.fieldResourceUris,
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
				"Use address as the primary user-facing label when showing suggestions.",
				"confidence is a ranking signal, not a guarantee of correctness.",
				"lat and lon can be reused as geo context for later buyer listing searches.",
				"An empty array can mean either no match or intentionally suppressed short input text.",
			],
			itemSchemaUri: resourceLocationSchema.uri,
			relatedSchemas: [
				resourceLocationSchema.uri,
			],
		});
	},
};
