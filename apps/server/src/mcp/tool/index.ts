import type { z } from "zod";
import { toolListingCollection } from "~/mcp/buyer/tool/listing-collection/toolListingCollection";
import { toolListingFetch } from "~/mcp/buyer/tool/listing-fetch/toolListingFetch";
import type { McpToolDefinition } from "~/mcp/McpToolDefinition";

export const mcpTools = [
	toolListingFetch,
	toolListingCollection,
] as const satisfies readonly McpToolDefinition.Definition<z.ZodType, z.ZodType>[];
