import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { withCollectionSchema } from "../../schema/withCollectionSchema";
import { ListingFlagQuerySchema } from "./schema/ListingFlagQuerySchema";
import { ListingFlagSchema } from "./schema/ListingFlagSchema";
import { listingFlagCollectionFx } from "./service/listingFlagCollectionFx";

export const withListingFlagCollectionApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/listing-flag/collection",
			description: "Returns listing flag items based on provided parameters",
			operationId: "apiListingFlagCollection",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingFlagQuerySchema,
						},
					},
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: withCollectionSchema({
								schema: ListingFlagSchema,
								type: "ListingFlagCollection",
								description: "Collection of listing flag items",
							}),
						},
					},
					description: "Access collection of listing flag items based on provided query",
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
				"listing-flag",
				"session",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json<withCollectionSchema.Type<ListingFlagSchema>, 200>(
					yield* listingFlagCollectionFx({
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
