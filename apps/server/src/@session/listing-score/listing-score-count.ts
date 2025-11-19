import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import type { Routes } from "../../hono/Routes";
import { CountSchema } from "../../schema/CountSchema";
import { MessageSchema } from "../../schema/MessageSchema";
import { ListingScoreCountQuerySchema } from "./schema/ListingScoreCountQuerySchema";
import { listingScoreCountFx } from "./service/listingScoreCountFx";

export const withListingScoreCountApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/listing-score/count",
			description: "Returns count of listing scores based on provided query",
			operationId: "apiListingScoreCount",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingScoreCountQuerySchema,
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
				"listing-score",
				"session",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json<CountSchema.Type, 200>(
					yield* listingScoreCountFx({
						database: c.get("database"),
						userId: c.get("user").id,
						query: c.req.valid("json"),
					}),
					200,
				);
			}).pipe(
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
