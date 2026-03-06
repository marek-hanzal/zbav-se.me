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

interface StaticProfileResourceEntry extends StaticResourceEntry {
	profileName: string;
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
	{
		documentPath: "guide/query-profiles.json",
		staticUrl: "/mcp/guide/query-profiles.json",
		uri: McpSchema.withGuideResourceUri("query-profiles"),
	},
	{
		documentPath: "guide/failures.json",
		staticUrl: "/mcp/guide/failures.json",
		uri: McpSchema.withGuideResourceUri("failures"),
	},
] as const satisfies readonly StaticResourceEntry[];

const staticProfileResources = [
	{
		profileName: "buyer.search.byDelivery",
		documentPath: "profile/buyer-search-by-delivery.json",
		staticUrl: "/mcp/profile/buyer-search-by-delivery.json",
		uri: McpSchema.withProfileResourceUri("buyer.search.byDelivery"),
	},
	{
		profileName: "buyer.search.nearby",
		documentPath: "profile/buyer-search-nearby.json",
		staticUrl: "/mcp/profile/buyer-search-nearby.json",
		uri: McpSchema.withProfileResourceUri("buyer.search.nearby"),
	},
	{
		profileName: "buyer.search.mine",
		documentPath: "profile/buyer-search-mine.json",
		staticUrl: "/mcp/profile/buyer-search-mine.json",
		uri: McpSchema.withProfileResourceUri("buyer.search.mine"),
	},
	{
		profileName: "buyer.search.byCategory",
		documentPath: "profile/buyer-search-by-category.json",
		staticUrl: "/mcp/profile/buyer-search-by-category.json",
		uri: McpSchema.withProfileResourceUri("buyer.search.byCategory"),
	},
	{
		profileName: "buyer.search.favourites",
		documentPath: "profile/buyer-search-favourites.json",
		staticUrl: "/mcp/profile/buyer-search-favourites.json",
		uri: McpSchema.withProfileResourceUri("buyer.search.favourites"),
	},
] as const satisfies readonly StaticProfileResourceEntry[];

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
		fieldName: "listing.delivery",
		documentPath: "field/listing-delivery.json",
		staticUrl: "/mcp/field/listing-delivery.json",
		uri: McpSchema.withFieldResourceUri("listing.delivery"),
	},
	{
		fieldName: "listing.location",
		documentPath: "field/listing-location.json",
		staticUrl: "/mcp/field/listing-location.json",
		uri: McpSchema.withFieldResourceUri("listing.location"),
	},
	{
		fieldName: "listing.category",
		documentPath: "field/listing-category.json",
		staticUrl: "/mcp/field/listing-category.json",
		uri: McpSchema.withFieldResourceUri("listing.category"),
	},
	{
		fieldName: "listing.gallery",
		documentPath: "field/listing-gallery.json",
		staticUrl: "/mcp/field/listing-gallery.json",
		uri: McpSchema.withFieldResourceUri("listing.gallery"),
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
	{
		fieldName: "listing.distance",
		documentPath: "field/listing-distance.json",
		staticUrl: "/mcp/field/listing-distance.json",
		uri: McpSchema.withFieldResourceUri("listing.distance"),
	},
	{
		fieldName: "listing.isFavourite",
		documentPath: "field/listing-is-favourite.json",
		staticUrl: "/mcp/field/listing-is-favourite.json",
		uri: McpSchema.withFieldResourceUri("listing.isFavourite"),
	},
	{
		fieldName: "listing.isIgnored",
		documentPath: "field/listing-is-ignored.json",
		staticUrl: "/mcp/field/listing-is-ignored.json",
		uri: McpSchema.withFieldResourceUri("listing.isIgnored"),
	},
	{
		fieldName: "listing.hasFlag",
		documentPath: "field/listing-has-flag.json",
		staticUrl: "/mcp/field/listing-has-flag.json",
		uri: McpSchema.withFieldResourceUri("listing.hasFlag"),
	},
	{
		fieldName: "filter.my",
		documentPath: "field/filter-my.json",
		staticUrl: "/mcp/field/filter-my.json",
		uri: McpSchema.withFieldResourceUri("filter.my"),
	},
	{
		fieldName: "filter.isFavourite",
		documentPath: "field/filter-is-favourite.json",
		staticUrl: "/mcp/field/filter-is-favourite.json",
		uri: McpSchema.withFieldResourceUri("filter.isFavourite"),
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

const withStaticProfileResource = (profileName: string): StaticProfileResourceEntry => {
	const resource = staticProfileResources.find((item) => item.profileName === profileName);
	if (!resource) {
		throw new Error(`Unknown MCP profile resource: ${profileName}`);
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

export const withStaticProfileResourceTemplate = (): McpResourceDefinition.TemplateDefinition => {
	return {
		name: "mcp-profile",
		title: "Profile: Template",
		description:
			"Parameterized query profile documentation for buyer-side MCP search intent patterns.",
		mimeType: "application/json",
		uriTemplate: "zbav://mcp/profile/{profileName}",
		complete: {
			profileName(value) {
				return staticProfileResources
					.map((resource) => resource.profileName)
					.filter((profileName) => profileName.includes(value));
			},
		},
		list() {
			return {
				resources: staticProfileResources.map(({ uri, documentPath }) => {
					const document = withDocument(documentPath);

					return {
						uri,
						name: `mcp-profile-${document.name}`,
						title: document.title,
						description: document.description,
						mimeType: "application/json" as const,
					};
				}),
			};
		},
		read(uri, variables) {
			const profileName = variables.profileName;
			if (typeof profileName !== "string") {
				throw new Error(`Missing MCP profileName variable for resource: ${uri.toString()}`);
			}

			const resource = withStaticProfileResource(profileName);
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
