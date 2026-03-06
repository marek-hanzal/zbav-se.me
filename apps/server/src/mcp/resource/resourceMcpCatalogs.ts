import type { z } from "zod";
import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";
import type { McpToolDefinition } from "~/mcp/McpToolDefinition";

interface WithResourceMcpCatalogsProps {
	resources: readonly McpResourceDefinition.Definition[];
	templates: readonly McpResourceDefinition.TemplateDefinition[];
	tools: readonly McpToolDefinition.Definition<z.ZodType, z.ZodType>[];
}

interface CatalogEntry {
	description: string;
	mimeType: "application/json";
	name: string;
	title: string;
	uri: string;
}

interface CatalogDefinition {
	catalogUri: string;
	description: string;
	resourcePrefix?: string;
	templateName?: string;
	title: string;
}

const catalogDefinitions = [
	{
		catalogUri: "zbav://mcp/catalog/guides",
		title: "Catalog: Guides",
		description: "Browsable catalog of MCP guide documents for agent behavior and workflow.",
		resourcePrefix: "zbav://mcp/guide/",
	},
	{
		catalogUri: "zbav://mcp/catalog/profiles",
		title: "Catalog: Profiles",
		description: "Browsable catalog of canonical MCP query profiles and intent-safe patterns.",
		templateName: "mcp-profile",
	},
	{
		catalogUri: "zbav://mcp/catalog/entities",
		title: "Catalog: Entities",
		description: "Browsable catalog of MCP marketplace entity documentation.",
		templateName: "mcp-entity",
	},
	{
		catalogUri: "zbav://mcp/catalog/enums",
		title: "Catalog: Enums",
		description: "Browsable catalog of MCP enum semantics and allowed value meanings.",
		templateName: "mcp-enum",
	},
	{
		catalogUri: "zbav://mcp/catalog/fields",
		title: "Catalog: Fields",
		description: "Browsable catalog of MCP field semantics, invariants, and caveats.",
		templateName: "mcp-field",
	},
	{
		catalogUri: "zbav://mcp/catalog/schemas",
		title: "Catalog: Schemas",
		description: "Browsable catalog of MCP schema resources exposed by the server.",
		resourcePrefix: "zbav://mcp/schema/",
	},
] as const satisfies readonly CatalogDefinition[];

const withTemplateEntries = ({
	templates,
	templateName,
}: {
	templates: readonly McpResourceDefinition.TemplateDefinition[];
	templateName: string;
}): CatalogEntry[] => {
	const template = templates.find((item) => item.name === templateName);
	if (!template) {
		return [];
	}

	return template.list().resources;
};

const withResourceEntries = ({
	resources,
	resourcePrefix,
}: {
	resources: readonly McpResourceDefinition.Definition[];
	resourcePrefix: string;
}): CatalogEntry[] => {
	return resources
		.filter((resource) => resource.uri.startsWith(resourcePrefix))
		.map(({ description, mimeType, name, title, uri }) => ({
			description,
			mimeType,
			name,
			title,
			uri,
		}));
};

const withCatalogEntries = ({
	definition,
	resources,
	templates,
}: {
	definition: CatalogDefinition;
	resources: readonly McpResourceDefinition.Definition[];
	templates: readonly McpResourceDefinition.TemplateDefinition[];
}): CatalogEntry[] => {
	if (definition.templateName) {
		return withTemplateEntries({
			templates,
			templateName: definition.templateName,
		});
	}

	if (definition.resourcePrefix) {
		return withResourceEntries({
			resources,
			resourcePrefix: definition.resourcePrefix,
		});
	}

	return [];
};

const withCatalogResource = ({
	definition,
	entries,
}: {
	definition: CatalogDefinition;
	entries: CatalogEntry[];
}): McpResourceDefinition.Definition => {
	return {
		name: definition.catalogUri.replace("zbav://", "").replaceAll("/", "-"),
		uri: definition.catalogUri,
		title: definition.title,
		description: definition.description,
		mimeType: "application/json",
		read(uri) {
			return McpResourceDefinition.withContent(uri, {
				catalogUri: definition.catalogUri,
				title: definition.title,
				description: definition.description,
				count: entries.length,
				entries,
			});
		},
	};
};

export const withResourceMcpCatalogs = ({
	resources,
	templates,
	tools,
}: WithResourceMcpCatalogsProps): McpResourceDefinition.Definition[] => {
	const catalogs = catalogDefinitions.map((definition) => {
		const entries = withCatalogEntries({
			definition,
			resources,
			templates,
		});

		return {
			definition,
			entries,
		};
	});

	return [
		{
			name: "mcp-index",
			uri: "zbav://mcp/index",
			title: "MCP Index",
			description:
				"Top-level MCP navigation index for tools, schemas, guides, profiles, entities, enums, and field documentation.",
			mimeType: "application/json",
			read(uri) {
				return McpResourceDefinition.withContent(uri, {
					title: "MCP Index",
					description:
						"Start here if the client does not render the MCP resource tree clearly.",
					toolCatalogUri: "zbav://mcp/tools",
					healthUri: "zbav://mcp/health",
					toolCount: tools.length,
					toolNames: tools.map((tool) => `${tool.namespace}.${tool.name}`),
					recommendedReadOrder: [
						"zbav://mcp/catalog/guides",
						"zbav://mcp/catalog/profiles",
						"zbav://mcp/catalog/entities",
						"zbav://mcp/catalog/enums",
						"zbav://mcp/catalog/fields",
						"zbav://mcp/catalog/schemas",
						"zbav://mcp/tools",
					],
					catalogs: catalogs.map(({ definition, entries }) => ({
						uri: definition.catalogUri,
						title: definition.title,
						description: definition.description,
						count: entries.length,
					})),
				});
			},
		},
		...catalogs.map(({ definition, entries }) =>
			withCatalogResource({
				definition,
				entries,
			}),
		),
	];
};
