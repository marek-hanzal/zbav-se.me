import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { favouriteFeedCollectionFx } from "~/@user/favourite-feed/fx/favouriteFeedCollectionFx";
import { FavouriteFeedSchema } from "~/@user/favourite-feed/schema/FavouriteFeedSchema";
import { FeedQuerySchema } from "~/@user/feed/schema/FeedQuerySchema";
import { UserContextProvider } from "~/auth/fx/UserContextFx";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import { MessageSchema } from "~/schema/MessageSchema";
import { withCollectionSchema } from "~/schema/withCollectionSchema";

export const withFavouriteFeedCollectionApi: Routes.Fn = ({ userHono }) => {
	userHono.openapi(
		createRoute({
			method: "post",
			path: "/favourite-feed/collection",
			description: "Returns feed items from favourites based on provided parameters",
			operationId: "apiFavouriteFeedCollection",
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
								schema: FavouriteFeedSchema,
								type: "FavouriteFeedCollection",
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
							schema: MessageSchema,
						},
					},
					description: "Internal server error",
				},
			},
			tags: [
				"favourite-feed",
				"user",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json<withCollectionSchema.Type<FavouriteFeedSchema>, 200>(
					yield* favouriteFeedCollectionFx({
						query: c.req.valid("json"),
					}),
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
									return c.json<MessageSchema.Type, 500>(
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
