import { createRoute } from "@hono/zod-openapi";
import { Effect } from "effect";
import { match } from "ts-pattern";
import { database } from "../../database/kysely";
import type { Routes } from "../../hono/Routes";
import { CountSchema } from "../../schema/CountSchema";
import { MessageSchema } from "../../schema/MessageSchema";
import { FeedQuerySchema } from "./schema/FeedQuerySchema";
import { feedCountFx } from "./service/feedCountFx";

export const withFeedCountApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/feed/count",
			description: "Returns count of feed items based on provided query (user-specific)",
			operationId: "apiFeedCount",
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
							schema: CountSchema,
						},
					},
					description: "Return counts based on provided query",
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
				"session",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				const json = c.req.valid("json");
				const user = c.get("user");

				return yield* feedCountFx({
					database: database.kysely,
					userId: user.id,
					query: json,
				});
			}).pipe(
				Effect.matchEffect({
					onSuccess(count) {
						return Effect.succeed(c.json<CountSchema.Type, 200>(count, 200));
					},
					onFailure(e) {
						/**
						 * This just holds type exhaustive match for errors if any comes up.
						 */
						match(e).exhaustive();

						return Effect.succeed(
							c.json<MessageSchema.Type, 500>(
								{
									type: "error",
									message: "This should not happen",
								},
								500,
							),
						);
					},
				}),
				Effect.runPromise,
			);
		},
	);
};
