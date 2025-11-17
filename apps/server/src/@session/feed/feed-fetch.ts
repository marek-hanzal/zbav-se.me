import { createRoute } from "@hono/zod-openapi";
import { Effect } from "effect";
import { match } from "ts-pattern";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { FeedQuerySchema } from "./schema/FeedQuerySchema";
import { FeedSchema } from "./schema/FeedSchema";
import { feedFetchFx } from "./service/feedFetchFx";

export const withFeedFetchApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/feed/fetch",
			description: "Return a feed item based on the provided query",
			operationId: "apiFeedFetch",
			request: {
				body: {
					content: {
						"application/json": {
							schema: FeedQuerySchema,
						},
					},
					description: "Query object for feed fetch",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: FeedSchema,
						},
					},
					description: "Return a feed item based on the provided query",
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
				const query = c.req.valid("json");
				const user = c.get("user");

				return yield* feedFetchFx({
					userId: user.id,
					query,
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
