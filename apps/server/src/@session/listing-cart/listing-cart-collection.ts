import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { withCollectionSchema } from "../../schema/withCollectionSchema";
import { DatabaseContextProvider } from "../../service/DatabaseContextFx";
import { UserContextProvider } from "../../service/UserContextFx";
import { ListingCartQuerySchema } from "./schema/ListingCartQuerySchema";
import { ListingCartSchema } from "./schema/ListingCartSchema";
import { listingCartCollectionFx } from "./service/listingCartCollectionFx";

export const withListingCartCollectionApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/listing-cart/collection",
			description: "Returns listing cart items based on provided parameters",
			operationId: "apiListingCartCollection",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingCartQuerySchema,
						},
					},
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: withCollectionSchema({
								schema: ListingCartSchema,
								type: "ListingCartCollection",
								description: "Collection of listing cart items",
							}),
						},
					},
					description: "Access collection of listing cart items based on provided query",
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
				"listing-cart",
				"session",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json<withCollectionSchema.Type<ListingCartSchema>, 200>(
					yield* listingCartCollectionFx({
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
