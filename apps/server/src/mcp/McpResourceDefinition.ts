export namespace McpResourceDefinition {
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
