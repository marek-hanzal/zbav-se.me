import { createRoute, z } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { feedFavouriteCollectionFx } from "~/app/feed/fx/feedFavouriteCollectionFx";
import { FeedQuerySchema } from "~/app/feed/schema/FeedQuerySchema";
import { RoutesContextFx } from "~/app/routes/RoutesContextFx";
import { KyselyContextLayer } from "~/database/context/KyselyContextLayer";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { withCollectionSchema } from "~/schema/withCollectionSchema";
import { FeedFavouriteItemSchema } from "./schema/FeedFavouriteItemSchema";

const CollectionSchema = withCollectionSchema({
	schema: FeedFavouriteItemSchema,
	type: "FeedFavouriteItemSchema",
	description: "Collection of feed items from favourites",
});

export const withFeedFavouriteCollectionApiFx = Effect.fn("withFeedFavouriteCollectionApiFx")(
	function* () {
		const { userHono } = yield* RoutesContextFx;
		userHono.openapi(
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
					"feed-favourite",
					"user",
				],
			}),
			async (c) => {
				return Effect.gen(function* () {
					const user = c.get("user");

					return c.json<withCollectionSchema.Type<FeedFavouriteItemSchema>, 200>(
						yield* zodFx({
							schema: CollectionSchema,
							dataFx: feedFavouriteCollectionFx({
								...c.req.valid("json"),
								userId: user.id,
								scope: {
									userId: user.id,
								},
							}) satisfies Effect.Effect<
								withCollectionSchema.Type<FeedFavouriteItemSchema>,
								any,
								any
							>,
						}),
						200,
					);
				}).pipe(
					Effect.provide(KyselyContextLayer(c.get("kysely"))),
					//
					Effect.catchAll((e) => {
						return Effect.succeed(
							Match.value(e).pipe(
								Match.when(
									{
										_tag: "ZodErrorFx",
									},
									({ zod }) => {
										return c.json<NoticeSchema.Type, 500>(
											{
												type: "error",
												message: z.prettifyError(zod),
											},
											500,
										);
									},
								),
								Match.exhaustive,
							),
						);
					}),
					Effect.runPromise,
				);
			},
		);
	},
);
