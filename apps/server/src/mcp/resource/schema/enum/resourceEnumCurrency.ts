import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";

export const resourceEnumCurrency: McpResourceDefinition.Definition = {
	name: "mcp-enum-currency",
	uri: McpSchema.withEnumResourceUri("currency"),
	title: "Enum: Currency",
	description: "Meaning of currency codes used in listing price fields and filters.",
	mimeType: "application/json",
	read(uri) {
		return McpResourceDefinition.withContent(uri, {
			name: "currency",
			title: "Enum: Currency",
			kind: "enum",
			purpose: "Currency code used for listing prices and price filters.",
			values: {
				CZK: "Czech koruna.",
				EUR: "Euro.",
				USD: "United States dollar.",
				GBP: "British pound sterling.",
				PLN: "Polish zloty.",
				HUF: "Hungarian forint.",
				CHF: "Swiss franc.",
			},
		});
	},
};
