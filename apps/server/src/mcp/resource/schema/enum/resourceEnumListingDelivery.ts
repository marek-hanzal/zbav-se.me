import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";

export const resourceEnumListingDelivery: McpResourceDefinition.Definition = {
	name: "mcp-enum-listing-delivery",
	uri: McpSchema.withEnumResourceUri("listing-delivery"),
	title: "Enum: Listing Delivery",
	description: "Meaning of listing delivery method values.",
	mimeType: "application/json",
	read(uri) {
		return McpResourceDefinition.withContent(uri, {
			name: "listing-delivery",
			title: "Enum: Listing Delivery",
			kind: "enum",
			purpose: "Delivery methods supported by a listing.",
			values: {
				personal: "Personal handover.",
				post: "Postal delivery.",
				package: "Package shipment or parcel service.",
				other: "Another delivery method not covered by the standard options.",
			},
		});
	},
};
