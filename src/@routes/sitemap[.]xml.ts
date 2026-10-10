import { createFileRoute } from "@tanstack/react-router";
import { Effect } from "effect";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withDateServiceFx } from "~/date/fx/withDateServiceFx";
import { withListingBucketsFx } from "~/public-listing/fx/withListingBucketsFx";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withOriginMiddleware } from "~/request-middleware/middleware/withOriginMiddleware";
import { toStreamResponse } from "~/sitemap/fn/index";

export const Route = createFileRoute("/sitemap.xml")({
	server: {
		middleware: [
			withDatabaseMiddleware,
			withOriginMiddleware,
		],
		handlers: {
			async GET({ context: { database, origin } }) {
				return toStreamResponse({
					root: "sitemapindex",
					child: "sitemap",
					entries: (async function* () {
						const buckets = await withListingBucketsFx({}).pipe(
							withKyselyFx(database),
							withDateServiceFx(),
							Effect.runPromise,
						);

						yield {
							loc: new URL("/sitemaps/pages.xml", origin).toString(),
						};

						for (const bucket of buckets) {
							for (let index = 0; index < bucket.pages; index += 1) {
								yield {
									loc: new URL(
										`/sitemaps/listings/${bucket.day}/${index + 1}.xml`,
										origin,
									).toString(),
									lastmod: bucket.lastmod,
								};
							}
						}
					})(),
					cacheControl: "public, max-age=300, stale-while-revalidate=86400",
				});
			},
		},
	},
});
