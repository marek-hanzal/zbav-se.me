import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { FeedQuerySchema } from "~/app/feed/schema/FeedQuerySchema";
import { feedFavouriteCollectionFx } from "~/app/feed-favourite/fx/feedFavouriteCollectionFx";
import { FeedFavouriteSchema } from "~/app/feed-favourite/schema/FeedFavouriteSchema";
import { UserContextProvider } from "~/auth/fx/UserContextFx";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { withCollectionSchema } from "~/schema/withCollectionSchema";

export const withFeedFavouriteCollectionApi: Routes.Fn = ({ userHono }) => {
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
							schema: withCollectionSchema({
								schema: FeedFavouriteSchema,
								type: "FeedFavouriteCollection",
								description: "Collection of feed items from favourites",
							}),
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
				return c.json<withCollectionSchema.Type<FeedFavouriteSchema>, 200>(
					yield* feedFavouriteCollectionFx(c.req.valid("json")),
					200,
				);
			}).pipe(
				DatabaseContextProvider(c.get("database")),
				UserContextProvider(c.get("user")),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{
									_tag: "UnknownException",
								},
								() => {
									return c.json<NoticeSchema.Type, 500>(
										{
											type: "error",
											message: e.message,
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
};
