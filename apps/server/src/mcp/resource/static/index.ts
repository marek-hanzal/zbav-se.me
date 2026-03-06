import overview from "../../../../public/mcp/guide/overview.json";
import listingBehavior from "../../../../public/mcp/guide/listing-behavior.json";
import roles from "../../../../public/mcp/guide/roles.json";
import rules from "../../../../public/mcp/guide/rules.json";
import category from "../../../../public/mcp/entity/category.json";
import draft from "../../../../public/mcp/entity/draft.json";
import gallery from "../../../../public/mcp/entity/gallery.json";
import listing from "../../../../public/mcp/entity/listing.json";
import location from "../../../../public/mcp/entity/location.json";
import currency from "../../../../public/mcp/schema/enum/currency.json";
import listingDelivery from "../../../../public/mcp/schema/enum/listing-delivery.json";
import listingPrice from "../../../../public/mcp/schema/enum/listing-price.json";
import listingRestriction from "../../../../public/mcp/schema/enum/listing-restriction.json";
import listingSort from "../../../../public/mcp/schema/enum/listing-sort.json";
import listingWarranty from "../../../../public/mcp/schema/enum/listing-warranty.json";
import thumb from "../../../../public/mcp/schema/enum/thumb.json";
import { McpSchema } from "~/mcp/McpSchema";
import type { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import type { StaticResourceDocument } from "~/mcp/resource/static/StaticResourceDocument";
import { withStaticResourceDefinition } from "~/mcp/resource/static/withStaticResourceDefinition";

interface StaticResourceEntry {
	document: StaticResourceDocument.Any;
	staticUrl: string;
	uri: string;
}

const staticResources = [
	{
		document: overview as StaticResourceDocument.Guide,
		staticUrl: "/mcp/guide/overview.json",
		uri: McpSchema.withGuideResourceUri("overview"),
	},
	{
		document: rules as StaticResourceDocument.Guide,
		staticUrl: "/mcp/guide/rules.json",
		uri: McpSchema.withGuideResourceUri("rules"),
	},
	{
		document: roles as StaticResourceDocument.Guide,
		staticUrl: "/mcp/guide/roles.json",
		uri: McpSchema.withGuideResourceUri("roles"),
	},
	{
		document: listingBehavior as StaticResourceDocument.Guide,
		staticUrl: "/mcp/guide/listing-behavior.json",
		uri: McpSchema.withGuideResourceUri("listing-behavior"),
	},
	{
		document: listing as StaticResourceDocument.Entity,
		staticUrl: "/mcp/entity/listing.json",
		uri: McpSchema.withEntityResourceUri("listing"),
	},
	{
		document: draft as StaticResourceDocument.Entity,
		staticUrl: "/mcp/entity/draft.json",
		uri: McpSchema.withEntityResourceUri("draft"),
	},
	{
		document: gallery as StaticResourceDocument.Entity,
		staticUrl: "/mcp/entity/gallery.json",
		uri: McpSchema.withEntityResourceUri("gallery"),
	},
	{
		document: location as StaticResourceDocument.Entity,
		staticUrl: "/mcp/entity/location.json",
		uri: McpSchema.withEntityResourceUri("location"),
	},
	{
		document: category as StaticResourceDocument.Entity,
		staticUrl: "/mcp/entity/category.json",
		uri: McpSchema.withEntityResourceUri("category"),
	},
	{
		document: listingRestriction as StaticResourceDocument.Enum,
		staticUrl: "/mcp/schema/enum/listing-restriction.json",
		uri: McpSchema.withEnumResourceUri("listing-restriction"),
	},
	{
		document: currency as StaticResourceDocument.Enum,
		staticUrl: "/mcp/schema/enum/currency.json",
		uri: McpSchema.withEnumResourceUri("currency"),
	},
	{
		document: listingPrice as StaticResourceDocument.Enum,
		staticUrl: "/mcp/schema/enum/listing-price.json",
		uri: McpSchema.withEnumResourceUri("listing-price"),
	},
	{
		document: listingWarranty as StaticResourceDocument.Enum,
		staticUrl: "/mcp/schema/enum/listing-warranty.json",
		uri: McpSchema.withEnumResourceUri("listing-warranty"),
	},
	{
		document: listingDelivery as StaticResourceDocument.Enum,
		staticUrl: "/mcp/schema/enum/listing-delivery.json",
		uri: McpSchema.withEnumResourceUri("listing-delivery"),
	},
	{
		document: thumb as StaticResourceDocument.Enum,
		staticUrl: "/mcp/schema/enum/thumb.json",
		uri: McpSchema.withEnumResourceUri("thumb"),
	},
	{
		document: listingSort as StaticResourceDocument.Enum,
		staticUrl: "/mcp/schema/enum/listing-sort.json",
		uri: McpSchema.withEnumResourceUri("listing-sort"),
	},
] as const satisfies readonly StaticResourceEntry[];

export const withStaticResources = (): McpResourceDefinition.Definition[] => {
	return staticResources.map(({ document, staticUrl, uri }) =>
		withStaticResourceDefinition({
			document,
			kind: document.kind,
			staticUrl,
			uri,
		}),
	);
};
