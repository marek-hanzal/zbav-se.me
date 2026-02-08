import { createRoute } from "@hono/zod-openapi";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { FeedQuerySchema } from "~/@buyer-user/feed/schema/FeedQuerySchema";
import { feedFavouriteCollectionFx } from "~/@buyer-user/feed-favourite/fx/feedFavouriteCollectionFx";
import { FeedFavouriteItemSchema } from "~/@buyer-user/feed-favourite/schema/FeedFavouriteItemSchema";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { withCollectionSchema } from "~/schema/withCollectionSchema";

const CollectionSchema = withCollectionSchema({
	schema: FeedFavouriteItemSchema,
	type: "FeedFavouriteItemSchema",
	description: "Collection of feed items from favourites",
});

export const withFeedFavouriteCollectionApiFx = Effect.fn("withFeedFavouriteCollectionApiFx")(
	function* () {
		const { buyerUserHono } = yield* RoutesContextFx;
		buyerUserHono.openapi(
			createRoute({
				method: "post",
				path: "/feed-favourite/collection",
				description: "Returns feed items from favourites based on provided parameters",
				operationId: "apiFeedFavouriteCollection",
				request: {
					body: {
						content: {
							"application/json": {
								schema: FeedQuerySchema,
							},
						},
					},
				},
				responses: {
					200: {
						content: {
							"application/json": {
								schema: CollectionSchema,
							},
						},
						description:
							"Access collection of feed items from favourites based on provided query",
					},
					500: {
						content: {
							"application/json": {
								schema: NoticeSchema,
							},
						},
						description: "Internal server error",
					},
				},
				tags: [
					"Feed Favourite",
				],
				summary:
					"Fetch a collection of feed items from favourites based on the provided query",
			}),
			async (c) => {
				const axiomConfig = ServerAxiomSchema.parse(process.env);

				return Effect.gen(function* () {
					const user = c.get("user");

					yield* Effect.annotateLogsScoped({
						endpoint: "apiFeedFavouriteCollection",
						userId: user.id,
					});

					return c.json(
						yield* zodGuardFx({
							schema: CollectionSchema,
							dataFx: feedFavouriteCollectionFx({
								...c.req.valid("json"),
								userId: user.id,
								scope: {
									userId: user.id,
								},
							}),
						}),
						200,
					);
				}).pipe(
					Effect.tap(() => Effect.log("apiFeedFavouriteCollection")),
					withKyselyFx(c.get("kysely")),
					withLoggingFx(axiomConfig),
					withCatchFx({
						ZodErrorFx({ zod }) {
							return c.json(noticeZodError(zod), 500);
						},
					}),
					Effect.runPromise,
				);
			},
		);
	},
);
