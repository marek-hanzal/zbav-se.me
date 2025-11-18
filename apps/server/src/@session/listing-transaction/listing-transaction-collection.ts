import { createRoute } from "@hono/zod-openapi";
import { Effect } from "effect";
import { match } from "ts-pattern";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { withCollectionSchema } from "../../schema/withCollectionSchema";
import { ListingTransactionQuerySchema } from "./schema/ListingTransactionQuerySchema";
import { ListingTransactionSchema } from "./schema/ListingTransactionSchema";
import { listingTransactionCollectionFx } from "./service/listingTransactionCollectionFx";

export const withListingTransactionCollectionApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
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
				"session",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return yield* listingTransactionCollectionFx({
					userId: c.get("user").id,
					query: c.req.valid("json"),
				});
			}).pipe(
				Effect.matchEffect({
					onSuccess(collection) {
						return Effect.succeed(
							c.json<withCollectionSchema.Type<ListingTransactionSchema>, 200>(
								collection,
								200,
							),
						);
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
