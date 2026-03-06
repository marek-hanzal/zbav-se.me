export namespace McpResourceDefinition {
	export interface ResourceItem {
		description: string;
		mimeType: "application/json";
		name: string;
		title: string;
		uri: string;
	}

	export interface ContentItem {
		mimeType: string;
		text: string;
		uri: string;
	}

	export interface Content {
		[key: string]: unknown;
		contents: ContentItem[];
	}

	export interface Definition {
		description: string;
		mimeType: "application/json";
		name: string;
		title: string;
		uri: string;
		read(uri: URL): Promise<Content> | Content;
	}

	export interface TemplateDefinition {
		complete?: {
			[variable: string]: (
				value: string,
				context?: {
					arguments?: Record<string, string>;
				},
			) => string[] | Promise<string[]>;
		};
		description: string;
		mimeType: "application/json";
		name: string;
		title: string;
		uriTemplate: string;
		list(): {
			resources: ResourceItem[];
		};
		read(uri: URL, variables: Record<string, string | string[]>): Promise<Content> | Content;
	}

	export const withContent = (uri: URL, value: unknown): Content => {
		return {
			contents: [
				{
					uri: uri.toString(),
					mimeType: "application/json",
					text: JSON.stringify(value),
				},
			],
		};
	};
}
