import { createRoute } from "@hono/zod-openapi";
import { Effect } from "effect";
import { match } from "ts-pattern";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { ListingTransactionQuerySchema } from "./schema/ListingTransactionQuerySchema";
import { ListingTransactionSchema } from "./schema/ListingTransactionSchema";
import { fetchListingTransactionFx } from "./service/fetchListingTransactionFx";

export const withListingTransactionFetchApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/listing-transaction/fetch",
			description: "Return a listing transaction based on the provided query",
			operationId: "apiListingTransactionFetch",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingTransactionQuerySchema,
						},
					},
					description: "Query object for listing transaction fetch",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: ListingTransactionSchema,
						},
					},
					description: "Listing transaction matching provided query",
				},
				404: {
					content: {
						"application/json": {
							schema: MessageSchema,
						},
					},
					description: "Listing transaction not found",
				},
			},
			tags: [
				"listing-transaction",
				"session",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				const json = c.req.valid("json");
				const user = c.get("user");

				return yield* fetchListingTransactionFx({
					userId: user.id,
					query: json,
				});
			}).pipe(
				Effect.matchEffect({
					onSuccess(listingTransaction) {
						return Effect.succeed(
							c.json<ListingTransactionSchema.Type, 200>(listingTransaction, {
								status: 200,
							}),
						);
					},
					onFailure(e) {
						/**
						 * This just holds type exhaustive match for errors if any comes up.
						 */
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
