import { resourceListingSchema } from "~/mcp/buyer/resource/resourceListingSchema";
import { resourceBuyerListingCollectionOutputSchema } from "~/mcp/buyer/tool/listing-collection/resourceBuyerListingCollectionOutputSchema";
import { resourceBuyerListingFetchOutputSchema } from "~/mcp/buyer/tool/listing-fetch/resourceBuyerListingFetchOutputSchema";
import type { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { withResourceMcpCatalogs } from "~/mcp/resource/resourceMcpCatalogs";
import { withResourceMcpHealth } from "~/mcp/resource/resourceMcpHealth";
import { withResourceMcpTools } from "~/mcp/resource/resourceMcpTools";
import {
	withStaticEntityResourceTemplate,
	withStaticEnumResourceTemplate,
	withStaticFieldResourceTemplate,
	withStaticProfileResourceTemplate,
	withStaticResources,
} from "~/mcp/resource/static";
import { resourceLocationSchema } from "~/mcp/session/resource/resourceLocationSchema";
import { resourceSessionLocationAutocompleteOutputSchema } from "~/mcp/session/tool/location-autocomplete/resourceSessionLocationAutocompleteOutputSchema";
import type { ServerInfo } from "~/mcp/serverInfo";
import { mcpTools } from "~/mcp/tool";

interface WithMcpResourcesProps {
	serverInfo: ServerInfo;
}

export const withMcpResources = ({
	serverInfo,
}: WithMcpResourcesProps): {
	resources: McpResourceDefinition.Definition[];
	templates: McpResourceDefinition.TemplateDefinition[];
} => {
	const resources: McpResourceDefinition.Definition[] = [
		withResourceMcpHealth({
			serverInfo,
			tools: mcpTools,
		}),
		withResourceMcpTools({
			tools: mcpTools,
		}),
		...withStaticResources(),
		resourceListingSchema,
		resourceLocationSchema,
		resourceBuyerListingFetchOutputSchema,
		resourceBuyerListingCollectionOutputSchema,
		resourceSessionLocationAutocompleteOutputSchema,
	];

	const templates: McpResourceDefinition.TemplateDefinition[] = [
		withStaticFieldResourceTemplate(),
		withStaticProfileResourceTemplate(),
		withStaticEntityResourceTemplate(),
		withStaticEnumResourceTemplate(),
	];

	return {
		resources: [
			...resources,
			...withResourceMcpCatalogs({
				resources,
				templates,
				tools: mcpTools,
			}),
		],
		templates,
	};
};
