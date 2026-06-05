import { createFileRoute } from "@tanstack/react-router";
import { Effect } from "effect";
import { z } from "zod";
import { withDateServiceFx } from "@/lib/common/date";
import { pathOf } from "~/common/route/pathOf";
import { toStreamResponse } from "~/common/sitemap";
import { locales } from "~/locales";
import { withListingBucketsFx } from "~/public/listing/server/fx/withListingBucketsFx";
import { withListingShardsFx } from "~/public/listing/server/fx/withListingShardsFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withOriginMiddleware } from "~/server/middleware/withOriginMiddleware";

const ParamsSchema = z.looseObject({
	day: z.iso.date(),
	page: z.coerce.number().int().positive(),
});

export const Route = createFileRoute("/sitemaps/listings/$day/{$page}.xml")({
	server: {
		middleware: [
			withDatabaseMiddleware,
			withOriginMiddleware,
		],
		handlers: {
			async GET({ params, context: { database, origin } }) {
				const { day, page } = ParamsSchema.parse(params);
				const [bucket] = await withListingBucketsFx({
					day,
				}).pipe(withKyselyFx(database), withDateServiceFx(), Effect.runPromise);

				if (!bucket) {
					return new Response("Not found", {
						status: 404,
					});
				}

				if (page > bucket.pages) {
					return new Response("Not found", {
						status: 404,
					});
				}

				return toStreamResponse({
					root: "urlset",
					child: "url",
					entries: (async function* () {
						const items = await withListingShardsFx({
							day,
							page,
						}).pipe(withKyselyFx(database), withDateServiceFx(), Effect.runPromise);

						for (const item of items) {
							for (const locale of locales) {
								yield {
									loc: new URL(
										pathOf("/$locale/z/$id/view")
											.replace("$locale", locale)
											.replace("$id", item.id),
										origin,
									).toString(),
									lastmod: item.updatedAt,
								};
							}
						}
					})(),
					cacheControl: "public, max-age=900, stale-while-revalidate=86400",
				});
			},
		},
	},
});
