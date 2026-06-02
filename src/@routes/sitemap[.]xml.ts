import { createFileRoute } from "@tanstack/react-router";
import { Effect } from "effect";
import { toStreamResponse } from "~/common/sitemap";
import { withListingBucketsFx } from "~/public/listing/server/fx/withListingBucketsFx";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withOriginMiddleware } from "~/server/middleware/withOriginMiddleware";

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
							withDateFx,
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
