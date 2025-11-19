import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { DatabaseContextProvider } from "../../database/fx/DatabaseContextFx";
import { UserContextProvider } from "../../fx/UserContextFx";
import type { Routes } from "../../hono/Routes";
import { CountSchema } from "../../schema/CountSchema";
import { MessageSchema } from "../../schema/MessageSchema";
import { listingScoreCountFx } from "./fx/listingScoreCountFx";
import { ListingScoreCountQuerySchema } from "./schema/ListingScoreCountQuerySchema";

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
