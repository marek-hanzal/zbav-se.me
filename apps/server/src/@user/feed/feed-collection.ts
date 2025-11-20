import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { UserContextProvider } from "../../auth/fx/UserContextFx";
import { DatabaseContextProvider } from "../../database/fx/DatabaseContextFx";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { withCollectionSchema } from "../../schema/withCollectionSchema";
import { feedCollectionFx } from "./fx/feedCollectionFx";
import { FeedQuerySchema } from "./schema/FeedQuerySchema";
import { FeedSchema } from "./schema/FeedSchema";

export const withFeedCollectionApi: Routes.Fn = ({ userHono }) => {
	userHono.openapi(
		createRoute({
			method: "post",
			path: "/feed/collection",
			description: "Returns feed items based on provided parameters",
			operationId: "apiFeedCollection",
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
								schema: FeedSchema,
								type: "FeedCollection",
								description: "Collection of feed items",
							}),
						},
					},
					description: "Access collection of feed items based on provided query",
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
				"feed",
				"user",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json<withCollectionSchema.Type<FeedSchema>, 200>(
					yield* feedCollectionFx({
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
