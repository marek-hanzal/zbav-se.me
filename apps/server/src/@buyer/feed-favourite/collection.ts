import { createRoute, z } from "@hono/zod-openapi";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { FeedQuerySchema } from "~/@buyer/feed/schema/FeedQuerySchema";
import { feedFavouriteCollectionFx } from "~/@buyer/feed-favourite/fx/feedFavouriteCollectionFx";
import { FeedFavouriteItemSchema } from "~/@buyer/feed-favourite/schema/FeedFavouriteItemSchema";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";

const CollectionSchema = z.array(FeedFavouriteItemSchema);

export const withFeedFavouriteCollectionApiFx = Effect.fn("withFeedFavouriteCollectionApiFx")(
	function* () {
		const { buyerHono } = yield* RoutesContextFx;
		buyerHono.openapi(
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
				return Effect.gen(function* () {
					const user = c.get("user");

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
					withKyselyFx(c.get("kysely")),
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
