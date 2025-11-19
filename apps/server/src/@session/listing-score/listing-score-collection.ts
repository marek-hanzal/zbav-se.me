import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { withCollectionSchema } from "../../schema/withCollectionSchema";
import { DatabaseContextProvider } from "../../service/DatabaseContextFx";
import { UserContextProvider } from "../../service/UserContextFx";
import { ListingScoreQuerySchema } from "./schema/ListingScoreQuerySchema";
import { ListingScoreSchema } from "./schema/ListingScoreSchema";
import { listingScoreCollectionFx } from "./service/listingScoreCollectionFx";

export const withListingScoreCollectionApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/listing-score/collection",
			description: "Returns listing scores based on provided parameters",
			operationId: "apiListingScoreCollection",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingScoreQuerySchema,
						},
					},
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: withCollectionSchema({
								schema: ListingScoreSchema,
								type: "ListingScoreCollection",
								description: "Collection of listing scores",
							}),
						},
					},
					description: "Access collection of listing scores based on provided query",
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
				return c.json<withCollectionSchema.Type<ListingScoreSchema>, 200>(
					yield* listingScoreCollectionFx({
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
