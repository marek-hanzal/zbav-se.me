import { createRoute } from "@hono/zod-openapi";
import { Effect } from "effect";
import { match } from "ts-pattern";
import { database } from "../../database/kysely";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { FeedCreateSchema } from "./schema/FeedCreateSchema";
import { FeedSchema } from "./schema/FeedSchema";
import { feedCreateFx } from "./service/feedCreateFx";

export const withFeedCreateApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/feed/create",
			description: "Create a new feed item",
			operationId: "apiFeedCreate",
			request: {
				body: {
					content: {
						"application/json": {
							schema: FeedCreateSchema,
						},
					},
					description: "Data for creating a new feed item",
				},
			},
			responses: {
				201: {
					content: {
						"application/json": {
							schema: FeedSchema,
						},
					},
					description: "The created feed item",
				},
				404: {
					content: {
						"application/json": {
							schema: MessageSchema,
						},
					},
					description: "Feed not found after creation",
				},
			},
			tags: [
				"feed",
				"session",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return yield* feedCreateFx({
					database: database.kysely,
					userId: c.get("user").id,
					data: c.req.valid("json"),
				});
			}).pipe(
				Effect.matchEffect({
					onSuccess(feed) {
						return Effect.succeed(c.json<FeedSchema.Type, 201>(feed, 201));
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
