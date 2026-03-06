import type { ToolAnnotations } from "@modelcontextprotocol/sdk/types.js";
import type { z } from "zod";
import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";
import type { McpToolDefinition } from "~/mcp/McpToolDefinition";

interface ResourceEntry {
	annotations: ToolAnnotations;
	argumentSummary: McpSchema.SummaryItem[];
	description: string;
	entityResourceUris: string[];
	examples: McpToolDefinition.Example<McpSchema.JsonRecord>[];
	fieldResourceUris: string[];
	guideResourceUris: string[];
	inputSchema: McpSchema.JsonSchema;
	name: string;
	namespace: string;
	outputSchema: McpSchema.JsonSchema;
	outputSchemaResourceUri: string;
	outputSummary: McpSchema.SummaryItem[];
	role: string;
	title: string;
	workflowHint: string;
}

interface WithResourceMcpToolsProps {
	tools: readonly McpToolDefinition.Definition<z.ZodType, z.ZodType>[];
}

const withResourceEntry = (
	tool: McpToolDefinition.Definition<z.ZodType, z.ZodType>,
): ResourceEntry => {
	const inputSchema = McpSchema.withJsonSchema(tool.inputSchema, "input");
	const outputSchema = McpSchema.withJsonSchema(tool.outputSchema, "output");

	return {
		name: `${tool.namespace}.${tool.name}`,
		namespace: tool.namespace,
		title: tool.title,
		description: tool.description,
		role: tool.role,
		annotations: tool.annotations,
		guideResourceUris: tool.guideResourceUris,
		entityResourceUris: tool.entityResourceUris,
		fieldResourceUris: tool.fieldResourceUris,
		inputSchema,
		outputSchema,
		argumentSummary: McpSchema.withSummary(inputSchema),
		outputSummary: McpSchema.withSummary(outputSchema),
		outputSchemaResourceUri: McpSchema.withSchemaResourceUri(`${tool.namespace}.${tool.name}`),
		examples: tool.examples as McpToolDefinition.Example<McpSchema.JsonRecord>[],
		workflowHint: tool.workflowHint,
	};
};

export const withResourceMcpTools = ({
	tools,
}: WithResourceMcpToolsProps): McpResourceDefinition.Definition => {
	return {
		name: "mcp-tools",
		uri: "zbav://mcp/tools",
		title: "MCP Tools",
		description:
			"Model-facing catalog of manually registered MCP tools, including annotations, schema summaries, and examples.",
		mimeType: "application/json",
		read(uri) {
			return McpResourceDefinition.withContent(uri, tools.map(withResourceEntry));
		},
	};
};
