import { createRoute } from "@hono/zod-openapi";
import { Effect } from "effect";
import { match } from "ts-pattern";
import { database } from "../../database/kysely";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { FeedQuerySchema } from "./schema/FeedQuerySchema";
import { FeedSchema } from "./schema/FeedSchema";
import { feedDeleteFx } from "./service/feedDeleteFx";

export const withFeedDeleteApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "delete",
			path: "/feed/delete",
			description: "Delete a feed item based on the provided query (user-specific)",
			operationId: "apiFeedDelete",
			request: {
				body: {
					content: {
						"application/json": {
							schema: FeedQuerySchema,
						},
					},
					description: "Query object for feed deletion",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: FeedSchema,
						},
					},
					description: "The deleted feed item",
				},
				404: {
					content: {
						"application/json": {
							schema: MessageSchema,
						},
					},
					description: "Feed item not found",
				},
			},
			tags: [
				"feed",
				"session",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return yield* feedDeleteFx({
					database: database.kysely,
					userId: c.get("user").id,
					query: c.req.valid("json"),
				});
			}).pipe(
				Effect.matchEffect({
					onSuccess(feed) {
						return Effect.succeed(c.json<FeedSchema.Type, 200>(feed, 200));
					},
					onFailure(e) {
						return match(e)
							.with(
								{
									_tag: "NotFoundError",
								},
								() => {
									return Effect.succeed(
										c.json<MessageSchema.Type, 404>({
											type: "error",
											message: e.message,
										}),
									);
								},
							)
							.exhaustive();
					},
				}),
				Effect.runPromise,
			);
		},
	);
};
