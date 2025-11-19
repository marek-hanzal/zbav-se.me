import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { DatabaseContextProvider } from "../../database/fx/DatabaseContextFx";
import { UserContextProvider } from "../../fx/UserContextFx";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { listingTransactionFetchFx } from "./fx/listingTransactionFetchFx";
import { listingTransactionGetBuyerInfoFx } from "./fx/listingTransactionGetBuyerInfoFx";
import { ListingTransactionBuyerInfoSchema } from "./schema/ListingTransactionBuyerInfoSchema";
import { ListingTransactionQuerySchema } from "./schema/ListingTransactionQuerySchema";

export const withListingTransactionBuyerInfoApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/listing-transaction/buyer-info",
			description:
				"Return buyer info for a listing transaction. Requires access to the transaction.",
			operationId: "apiListingTransactionBuyerInfo",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingTransactionQuerySchema,
						},
					},
					description: "Query object for listing transaction access validation",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: ListingTransactionBuyerInfoSchema,
						},
					},
					description: "Buyer info",
				},
				404: {
					content: {
						"application/json": {
							schema: MessageSchema,
						},
					},
					description: "Listing transaction not found or not accessible",
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
				const transaction = yield* listingTransactionFetchFx({
					query: c.req.valid("json"),
				});

				return c.json<ListingTransactionBuyerInfoSchema.Type, 200>(
					yield* listingTransactionGetBuyerInfoFx({
						transactionId: transaction.id,
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
									_tag: "NotFoundError",
								},
								() => {
									return c.json<MessageSchema.Type, 404>(
										{
											type: "error",
											message: e.message,
										},
										404,
									);
								},
							),
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
