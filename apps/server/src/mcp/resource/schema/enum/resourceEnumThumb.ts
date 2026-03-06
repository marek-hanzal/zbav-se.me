import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";

export const resourceEnumThumb: McpResourceDefinition.Definition = {
	name: "mcp-enum-thumb",
	uri: McpSchema.withEnumResourceUri("thumb"),
	title: "Enum: Thumb",
	description: "Meaning of buyer thumb values attached to a listing.",
	mimeType: "application/json",
	read(uri) {
		return McpResourceDefinition.withContent(uri, {
			name: "thumb",
			title: "Enum: Thumb",
			kind: "enum",
			purpose: "Buyer-specific thumb reaction attached to a listing.",
			values: {
				like: "The current user liked the listing.",
				dislike: "The current user explicitly disliked the listing.",
			},
		});
	},
};
