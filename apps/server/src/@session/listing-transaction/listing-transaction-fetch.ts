import { createRoute } from "@hono/zod-openapi";
import { withFetch } from "@use-pico/common/fetch";
import type { Routes } from "../../hono/Routes";
import { withCache } from "../../redis/withCache";
import { MessageSchema } from "../../schema/MessageSchema";
import { withListingTransactionQueryBuilder } from "./db/withListingTransactionQueryBuilder";
import { withListingTransactionSelect } from "./db/withListingTransactionSelect";
import { ListingTransactionQuerySchema } from "./schema/ListingTransactionQuerySchema";
import { ListingTransactionSchema } from "./schema/ListingTransactionSchema";

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
			const json = c.req.valid("json");
			const { filter, where, sort, meta } = json;
			const user = c.get("user");

			const userWhere = {
				...where,
				userId: user.id,
			};

			const { data, hit } = await withCache({
				key: {
					scope: "listing-transaction:fetch",
					version: "1",
					value: {
						userId: user.id,
						query: json,
					},
				},
				fetch: () =>
					withFetch({
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
					}),
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

			return c.json<ListingTransactionSchema.Type, 200>(data, {
				status: 200,
				headers: {
					"X-Cached": hit ? "true" : "false",
				},
			});
		},
	);
};
