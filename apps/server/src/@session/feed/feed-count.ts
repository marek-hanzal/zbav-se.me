import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import type { Routes } from "../../hono/Routes";
import { CountSchema } from "../../schema/CountSchema";
import { MessageSchema } from "../../schema/MessageSchema";
import { DatabaseContextProvider } from "../../service/DatabaseContextFx";
import { UserContextProvider } from "../../service/UserContextFx";
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
				return c.json<CountSchema.Type, 200>(
					yield* feedCountFx({
						query: c.req.valid("json"),
					}),
					200,
				);
			}).pipe(
				DatabaseContextProvider(c.get("database")),
				UserContextProvider(c.get("user")),
				//
				Effect.catchAll((e) => {
					/**
					 * This just holds type exhaustive match for errors if any comes up.
					 */
					Match.value(e).pipe(Match.exhaustive);

					return Effect.succeed(
						c.json<MessageSchema.Type, 500>(
							{
								type: "error",
								message: "This should not happen",
							},
							500,
						),
					);
				}),
				Effect.runPromise,
			);
		},
	);
};
