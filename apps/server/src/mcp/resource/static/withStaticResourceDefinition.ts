import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import type { StaticResourceDocument } from "~/mcp/resource/static/StaticResourceDocument";

interface WithStaticResourceDefinitionProps {
	document: StaticResourceDocument.Any;
	kind: StaticResourceDocument.Any["kind"];
	staticUrl: string;
	uri: string;
}

const withName = ({
	kind,
	name,
}: {
	kind: StaticResourceDocument.Any["kind"];
	name: string;
}): string => {
	switch (kind) {
		case "guide":
			return `mcp-guide-${name}`;
		case "profile":
			return `mcp-profile-${name}`;
		case "entity":
			return `mcp-entity-${name}`;
		case "enum":
			return `mcp-enum-${name}`;
		case "field":
			return `mcp-field-${name}`;
	}
};

export const withStaticResourceDefinition = ({
	document,
	kind,
	staticUrl,
	uri,
}: WithStaticResourceDefinitionProps): McpResourceDefinition.Definition => {
	return {
		name: withName({
			kind,
			name: document.name,
		}),
		uri,
		title: document.title,
		description: document.description,
		mimeType: "application/json",
		read(uri) {
			return McpResourceDefinition.withContent(uri, {
				...document,
				canonicalUri: uri.toString(),
				staticUrl,
			});
		},
	};
};
