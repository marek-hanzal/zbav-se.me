import { createCB } from "xmlbuilder2";

const sitemapXmlNamespace = "http://www.sitemaps.org/schemas/sitemap/0.9";
const encoder = new TextEncoder();

export namespace toStreamResponse {
	export interface Entry {
		loc: string;
		lastmod?: Date;
	}

	export type EntrySource = AsyncIterable<Entry>;
	export type Root = "urlset" | "sitemapindex";
	export type Child = "url" | "sitemap";

	export interface Props {
		root: Root;
		child: Child;
		entries: EntrySource;
		cacheControl: string;
	}
}

export function toStreamResponse({ root, child, entries, cacheControl }: toStreamResponse.Props) {
	return new Response(
		new ReadableStream<Uint8Array>({
			async start(controller) {
				const builder = createCB({
					data(chunk: string) {
						controller.enqueue(encoder.encode(chunk));
					},
					end() {
						controller.close();
					},
					prettyPrint: false,
				});

				try {
					builder
						.dec({
							version: "1.0",
							encoding: "UTF-8",
						})
						.ele(root, {
							xmlns: sitemapXmlNamespace,
						});

					for await (const entry of entries) {
						builder.ele(child).ele("loc").txt(entry.loc).up();

						if (entry.lastmod) {
							builder.ele("lastmod").txt(entry.lastmod.toISOString()).up();
						}

						builder.up();
					}

					builder.up().end();
				} catch (error) {
					controller.error(error);
				}
			},
		}),
		{
			headers: {
				"cache-control": cacheControl,
				"content-type": "application/xml; charset=utf-8",
			},
		},
	);
}
