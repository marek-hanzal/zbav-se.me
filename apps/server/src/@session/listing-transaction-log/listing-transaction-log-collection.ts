import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { DatabaseContextProvider } from "../../fx/DatabaseContextFx";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { withCollectionSchema } from "../../schema/withCollectionSchema";
import { listingTransactionLogCollectionFx } from "./fx/listingTransactionLogCollectionFx";
import { ListingTransactionLogQuerySchema } from "./schema/ListingTransactionLogQuerySchema";
import { ListingTransactionLogSchema } from "./schema/ListingTransactionLogSchema";

export const withListingTransactionLogCollectionApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/listing-transaction-log/collection",
			description: "Returns listing transaction log entries based on provided parameters",
			operationId: "apiListingTransactionLogCollection",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingTransactionLogQuerySchema,
						},
					},
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: withCollectionSchema({
								schema: ListingTransactionLogSchema,
								type: "ListingTransactionLogCollection",
								description: "Collection of listing transaction log entries",
							}),
						},
					},
					description:
						"Access collection of listing transaction log entries based on provided query",
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
				"listing-transaction-log",
				"session",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json<withCollectionSchema.Type<ListingTransactionLogSchema>, 200>(
					yield* listingTransactionLogCollectionFx({
						query: c.req.valid("json"),
					}),
					200,
				);
			}).pipe(
				DatabaseContextProvider(c.get("database")),
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
