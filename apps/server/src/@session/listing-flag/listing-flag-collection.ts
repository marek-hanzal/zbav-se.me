import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { DatabaseContextProvider } from "../../database/fx/DatabaseContextFx";
import { UserContextProvider } from "../../fx/UserContextFx";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { withCollectionSchema } from "../../schema/withCollectionSchema";
import { listingFlagCollectionFx } from "./fx/listingFlagCollectionFx";
import { ListingFlagQuerySchema } from "./schema/ListingFlagQuerySchema";
import { ListingFlagSchema } from "./schema/ListingFlagSchema";

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
