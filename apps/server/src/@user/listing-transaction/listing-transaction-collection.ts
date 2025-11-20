import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { UserContextProvider } from "../../auth/fx/UserContextFx";
import { DatabaseContextProvider } from "../../database/fx/DatabaseContextFx";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { withCollectionSchema } from "../../schema/withCollectionSchema";
import { listingTransactionCollectionFx } from "./fx/listingTransactionCollectionFx";
import { ListingTransactionQuerySchema } from "./schema/ListingTransactionQuerySchema";
import { ListingTransactionSchema } from "./schema/ListingTransactionSchema";

export const withListingTransactionCollectionApi: Routes.Fn = ({ userHono }) => {
	userHono.openapi(
		createRoute({
			method: "post",
			path: "/listing-transaction/collection",
			description: "Returns listing transactions based on provided parameters",
			operationId: "apiListingTransactionCollection",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingTransactionQuerySchema,
						},
					},
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: withCollectionSchema({
								schema: ListingTransactionSchema,
								type: "ListingTransactionCollection",
								description: "Collection of listing transactions",
							}),
						},
					},
					description:
						"Access collection of listing transactions based on provided query",
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
				"listing-transaction",
				"user",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json<withCollectionSchema.Type<ListingTransactionSchema>, 200>(
					yield* listingTransactionCollectionFx({
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
