import { createRoute } from "@hono/zod-openapi";
import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { withListingTransactionQueryBuilder } from "./db/withListingTransactionQueryBuilder";
import { withListingTransactionSelect } from "./db/withListingTransactionSelect";
import { ListingTransactionQuerySchema } from "./schema/ListingTransactionQuerySchema";
import { ListingTransactionSchema } from "./schema/ListingTransactionSchema";
import { ListingTransactionSellerInfoSchema } from "./schema/ListingTransactionSellerInfoSchema";
import { getListingTransactionSellerInfoFx } from "./service/getListingTransactionSellerInfoFx";

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
			const json = c.req.valid("json");
			const { filter, where, sort, meta } = json;
			const user = c.get("user");

			const userWhere = {
				...where,
				userId: user.id,
			};

			// Access validation only: ensure the user can see the listing-transaction
			const data = await withFetch({
				select: withListingTransactionSelect({
					sort,
				}),
				output: ListingTransactionSchema,
				filter,
				where: userWhere,
				query(query) {
					return withListingTransactionQueryBuilder({
						meta,
						...query,
					});
				},
			});

			if (!data) {
				return c.json<MessageSchema.Type, 404>(
					{
						type: "error",
						message: "Listing transaction not found",
					},
					404,
				);
			}

			const result = await Effect.runPromise(
				getListingTransactionSellerInfoFx({
					transactionId: data.id,
					userId: user.id,
				}),
			);
			return c.json<ListingTransactionSellerInfoSchema.Type, 200>(result, 200);
		},
	);
};
