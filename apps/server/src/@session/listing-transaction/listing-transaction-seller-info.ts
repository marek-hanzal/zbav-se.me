import { createRoute } from "@hono/zod-openapi";
import { Effect } from "effect";
import { match } from "ts-pattern";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { ListingTransactionQuerySchema } from "./schema/ListingTransactionQuerySchema";
import { ListingTransactionSellerInfoSchema } from "./schema/ListingTransactionSellerInfoSchema";
import { listingTransactionFetchFx } from "./service/listingTransactionFetchFx";
import { listingTransactionGetSellerInfoFx } from "./service/listingTransactionGetSellerInfoFx";

export const withListingTransactionSellerInfoApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/listing-transaction/seller-info",
			description:
				"Return seller info for a listing transaction. Requires access to the transaction.",
			operationId: "apiListingTransactionSellerInfo",
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
							schema: ListingTransactionSellerInfoSchema,
						},
					},
					description: "Seller info",
				},
				404: {
					content: {
						"application/json": {
							schema: MessageSchema,
						},
					},
					description: "Listing transaction not found or not accessible",
				},
			},
			tags: [
				"listing-transaction",
				"session",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = c.get("user");

				const transaction = yield* listingTransactionFetchFx({
					query: c.req.valid("json"),
					userId: user.id,
				});

				return yield* listingTransactionGetSellerInfoFx({
					transactionId: transaction.id,
					userId: user.id,
				});
			}).pipe(
				Effect.matchEffect({
					onSuccess(info) {
						return Effect.succeed(
							c.json<ListingTransactionSellerInfoSchema.Type, 200>(info, 200),
						);
					},
					onFailure(e) {
						return match(e)
							.with(
								{
									_tag: "NotFoundError",
								},
								() => {
									return Effect.succeed(
										c.json<MessageSchema.Type, 404>({
											type: "error",
											message: e.message,
										}),
									);
								},
							)
							.exhaustive();
					},
				}),
				Effect.runPromise,
			);
		},
	);
};
