import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";
import type { StaticResourceDocument } from "~/mcp/resource/static/StaticResourceDocument";
import { withStaticResourceDefinition } from "~/mcp/resource/static/withStaticResourceDefinition";

interface StaticResourceEntry {
	documentPath: string;
	staticUrl: string;
	uri: string;
}

interface StaticFieldResourceEntry extends StaticResourceEntry {
	fieldName: string;
}

interface StaticEntityResourceEntry extends StaticResourceEntry {
	entityName: string;
}

interface StaticEnumResourceEntry extends StaticResourceEntry {
	enumName: string;
}

const staticResources = [
	{
		documentPath: "guide/overview.json",
		staticUrl: "/mcp/guide/overview.json",
		uri: McpSchema.withGuideResourceUri("overview"),
	},
	{
		documentPath: "guide/rules.json",
		staticUrl: "/mcp/guide/rules.json",
		uri: McpSchema.withGuideResourceUri("rules"),
	},
	{
		documentPath: "guide/roles.json",
		staticUrl: "/mcp/guide/roles.json",
		uri: McpSchema.withGuideResourceUri("roles"),
	},
	{
		documentPath: "guide/listing-behavior.json",
		staticUrl: "/mcp/guide/listing-behavior.json",
		uri: McpSchema.withGuideResourceUri("listing-behavior"),
	},
	{
		documentPath: "guide/search-and-ranking.json",
		staticUrl: "/mcp/guide/search-and-ranking.json",
		uri: McpSchema.withGuideResourceUri("search-and-ranking"),
	},
] as const satisfies readonly StaticResourceEntry[];

const staticEntityResources = [
	{
		entityName: "listing",
		documentPath: "entity/listing.json",
		staticUrl: "/mcp/entity/listing.json",
		uri: McpSchema.withEntityResourceUri("listing"),
	},
	{
		entityName: "draft",
		documentPath: "entity/draft.json",
		staticUrl: "/mcp/entity/draft.json",
		uri: McpSchema.withEntityResourceUri("draft"),
	},
	{
		entityName: "gallery",
		documentPath: "entity/gallery.json",
		staticUrl: "/mcp/entity/gallery.json",
		uri: McpSchema.withEntityResourceUri("gallery"),
	},
	{
		entityName: "location",
		documentPath: "entity/location.json",
		staticUrl: "/mcp/entity/location.json",
		uri: McpSchema.withEntityResourceUri("location"),
	},
	{
		entityName: "category",
		documentPath: "entity/category.json",
		staticUrl: "/mcp/entity/category.json",
		uri: McpSchema.withEntityResourceUri("category"),
	},
] as const satisfies readonly StaticEntityResourceEntry[];

const staticEnumResources = [
	{
		enumName: "listing-restriction",
		documentPath: "schema/enum/listing-restriction.json",
		staticUrl: "/mcp/schema/enum/listing-restriction.json",
		uri: McpSchema.withEnumResourceUri("listing-restriction"),
	},
	{
		enumName: "currency",
		documentPath: "schema/enum/currency.json",
		staticUrl: "/mcp/schema/enum/currency.json",
		uri: McpSchema.withEnumResourceUri("currency"),
	},
	{
		enumName: "listing-price",
		documentPath: "schema/enum/listing-price.json",
		staticUrl: "/mcp/schema/enum/listing-price.json",
		uri: McpSchema.withEnumResourceUri("listing-price"),
	},
	{
		enumName: "listing-warranty",
		documentPath: "schema/enum/listing-warranty.json",
		staticUrl: "/mcp/schema/enum/listing-warranty.json",
		uri: McpSchema.withEnumResourceUri("listing-warranty"),
	},
	{
		enumName: "listing-delivery",
		documentPath: "schema/enum/listing-delivery.json",
		staticUrl: "/mcp/schema/enum/listing-delivery.json",
		uri: McpSchema.withEnumResourceUri("listing-delivery"),
	},
	{
		enumName: "thumb",
		documentPath: "schema/enum/thumb.json",
		staticUrl: "/mcp/schema/enum/thumb.json",
		uri: McpSchema.withEnumResourceUri("thumb"),
	},
	{
		enumName: "listing-sort",
		documentPath: "schema/enum/listing-sort.json",
		staticUrl: "/mcp/schema/enum/listing-sort.json",
		uri: McpSchema.withEnumResourceUri("listing-sort"),
	},
] as const satisfies readonly StaticEnumResourceEntry[];

const staticFieldResources = [
	{
		fieldName: "listing.my",
		documentPath: "field/listing-my.json",
		staticUrl: "/mcp/field/listing-my.json",
		uri: McpSchema.withFieldResourceUri("listing.my"),
	},
	{
		fieldName: "listing.age",
		documentPath: "field/listing-age.json",
		staticUrl: "/mcp/field/listing-age.json",
		uri: McpSchema.withFieldResourceUri("listing.age"),
	},
	{
		fieldName: "listing.condition",
		documentPath: "field/listing-condition.json",
		staticUrl: "/mcp/field/listing-condition.json",
		uri: McpSchema.withFieldResourceUri("listing.condition"),
	},
	{
		fieldName: "listing.priceType",
		documentPath: "field/listing-price-type.json",
		staticUrl: "/mcp/field/listing-price-type.json",
		uri: McpSchema.withFieldResourceUri("listing.priceType"),
	},
	{
		fieldName: "listing.restriction",
		documentPath: "field/listing-restriction.json",
		staticUrl: "/mcp/field/listing-restriction.json",
		uri: McpSchema.withFieldResourceUri("listing.restriction"),
	},
	{
		fieldName: "listing.warranty",
		documentPath: "field/listing-warranty.json",
		staticUrl: "/mcp/field/listing-warranty.json",
		uri: McpSchema.withFieldResourceUri("listing.warranty"),
	},
	{
		fieldName: "listing.transactionId",
		documentPath: "field/listing-transaction-id.json",
		staticUrl: "/mcp/field/listing-transaction-id.json",
		uri: McpSchema.withFieldResourceUri("listing.transactionId"),
	},
	{
		fieldName: "listing.thumb",
		documentPath: "field/listing-thumb.json",
		staticUrl: "/mcp/field/listing-thumb.json",
		uri: McpSchema.withFieldResourceUri("listing.thumb"),
	},
	{
		fieldName: "listing.draftId",
		documentPath: "field/listing-draft-id.json",
		staticUrl: "/mcp/field/listing-draft-id.json",
		uri: McpSchema.withFieldResourceUri("listing.draftId"),
	},
	{
		fieldName: "filter.range",
		documentPath: "field/filter-range.json",
		staticUrl: "/mcp/field/filter-range.json",
		uri: McpSchema.withFieldResourceUri("filter.range"),
	},
	{
		fieldName: "filter.withOwn",
		documentPath: "field/filter-with-own.json",
		staticUrl: "/mcp/field/filter-with-own.json",
		uri: McpSchema.withFieldResourceUri("filter.withOwn"),
	},
	{
		fieldName: "filter.withIgnored",
		documentPath: "field/filter-with-ignored.json",
		staticUrl: "/mcp/field/filter-with-ignored.json",
		uri: McpSchema.withFieldResourceUri("filter.withIgnored"),
	},
	{
		fieldName: "filter.feedId",
		documentPath: "field/filter-feed-id.json",
		staticUrl: "/mcp/field/filter-feed-id.json",
		uri: McpSchema.withFieldResourceUri("filter.feedId"),
	},
] as const satisfies readonly StaticFieldResourceEntry[];

const withPublicPath = (): string => {
	const candidates = [
		join(process.cwd(), "public/mcp"),
		join(process.cwd(), "apps/server/public/mcp"),
		join(process.cwd(), ".vercel/output/static/mcp"),
		join(process.cwd(), "apps/server/.vercel/output/static/mcp"),
		join(process.cwd(), "../static/mcp"),
	];

	for (const candidate of candidates) {
		if (existsSync(candidate)) {
			return candidate;
		}
	}

	throw new Error(`Unable to resolve MCP static resource directory from cwd: ${process.cwd()}`);
};

const publicPath = withPublicPath();

const withDocument = (documentPath: string): StaticResourceDocument.Any => {
	return JSON.parse(
		readFileSync(join(publicPath, documentPath), "utf8"),
	) as StaticResourceDocument.Any;
};

const withStaticFieldResource = (fieldName: string): StaticFieldResourceEntry => {
	const resource = staticFieldResources.find((item) => item.fieldName === fieldName);
	if (!resource) {
		throw new Error(`Unknown MCP field resource: ${fieldName}`);
	}

	return resource;
};

const withStaticEntityResource = (entityName: string): StaticEntityResourceEntry => {
	const resource = staticEntityResources.find((item) => item.entityName === entityName);
	if (!resource) {
		throw new Error(`Unknown MCP entity resource: ${entityName}`);
	}

	return resource;
};

const withStaticEnumResource = (enumName: string): StaticEnumResourceEntry => {
	const resource = staticEnumResources.find((item) => item.enumName === enumName);
	if (!resource) {
		throw new Error(`Unknown MCP enum resource: ${enumName}`);
	}

	return resource;
};

export const withStaticResources = (): McpResourceDefinition.Definition[] => {
	return staticResources.map(({ documentPath, staticUrl, uri }) => {
		const document = withDocument(documentPath);

		return withStaticResourceDefinition({
			document,
			kind: document.kind,
			staticUrl,
			uri,
		});
	});
};

export const withStaticFieldResourceTemplate = (): McpResourceDefinition.TemplateDefinition => {
	return {
		name: "mcp-field",
		title: "Field: Template",
		description:
			"Parameterized field documentation for MCP-visible buyer query and listing fields.",
		mimeType: "application/json",
		uriTemplate: "zbav://mcp/field/{fieldName}",
		complete: {
			fieldName(value) {
				return staticFieldResources
					.map((resource) => resource.fieldName)
					.filter((fieldName) => fieldName.includes(value));
			},
		},
		list() {
			return {
				resources: staticFieldResources.map(({ uri, documentPath }) => {
					const document = withDocument(documentPath);

					return {
						uri,
						name: `mcp-field-${document.name}`,
						title: document.title,
						description: document.description,
						mimeType: "application/json" as const,
					};
				}),
			};
		},
		read(uri, variables) {
			const fieldName = variables.fieldName;
			if (typeof fieldName !== "string") {
				throw new Error(`Missing MCP fieldName variable for resource: ${uri.toString()}`);
			}

			const resource = withStaticFieldResource(fieldName);
			const document = withDocument(resource.documentPath);

			return McpResourceDefinition.withContent(uri, {
				...document,
				canonicalUri: uri.toString(),
				staticUrl: resource.staticUrl,
			});
		},
	};
};

export const withStaticEntityResourceTemplate = (): McpResourceDefinition.TemplateDefinition => {
	return {
		name: "mcp-entity",
		title: "Entity: Template",
		description: "Parameterized entity documentation for MCP-visible marketplace entities.",
		mimeType: "application/json",
		uriTemplate: "zbav://mcp/entity/{entityName}",
		complete: {
			entityName(value) {
				return staticEntityResources
					.map((resource) => resource.entityName)
					.filter((entityName) => entityName.includes(value));
			},
		},
		list() {
			return {
				resources: staticEntityResources.map(({ uri, documentPath }) => {
					const document = withDocument(documentPath);

					return {
						uri,
						name: `mcp-entity-${document.name}`,
						title: document.title,
						description: document.description,
						mimeType: "application/json" as const,
					};
				}),
			};
		},
		read(uri, variables) {
			const entityName = variables.entityName;
			if (typeof entityName !== "string") {
				throw new Error(`Missing MCP entityName variable for resource: ${uri.toString()}`);
			}

			const resource = withStaticEntityResource(entityName);
			const document = withDocument(resource.documentPath);

			return McpResourceDefinition.withContent(uri, {
				...document,
				canonicalUri: uri.toString(),
				staticUrl: resource.staticUrl,
			});
		},
	};
};

export const withStaticEnumResourceTemplate = (): McpResourceDefinition.TemplateDefinition => {
	return {
		name: "mcp-enum",
		title: "Enum: Template",
		description: "Parameterized enum documentation for MCP-visible enum families.",
		mimeType: "application/json",
		uriTemplate: "zbav://mcp/schema/enum/{enumName}",
		complete: {
			enumName(value) {
				return staticEnumResources
					.map((resource) => resource.enumName)
					.filter((enumName) => enumName.includes(value));
			},
		},
		list() {
			return {
				resources: staticEnumResources.map(({ uri, documentPath }) => {
					const document = withDocument(documentPath);

					return {
						uri,
						name: `mcp-enum-${document.name}`,
						title: document.title,
						description: document.description,
						mimeType: "application/json" as const,
					};
				}),
			};
		},
		read(uri, variables) {
			const enumName = variables.enumName;
			if (typeof enumName !== "string") {
				throw new Error(`Missing MCP enumName variable for resource: ${uri.toString()}`);
			}

			const resource = withStaticEnumResource(enumName);
			const document = withDocument(resource.documentPath);

			return McpResourceDefinition.withContent(uri, {
				...document,
				canonicalUri: uri.toString(),
				staticUrl: resource.staticUrl,
			});
		},
	};
};
