import { createRoute } from "@hono/zod-openapi";
import { withCollection } from "@use-pico/common/collection";
import type { Routes } from "../../hono/Routes";
import { withCache } from "../../redis/withCache";
import { withCollectionSchema } from "../../schema/withCollectionSchema";
import { withListingTransactionLogQueryBuilder } from "./db/withListingTransactionLogQueryBuilder";
import { withListingTransactionLogSelect } from "./db/withListingTransactionLogSelect";
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
			},
			tags: [
				"listing-transaction-log",
				"session",
			],
		}),
		async (c) => {
			const json = c.req.valid("json");
			const { cursor, filter, where, sort } = json;

			const { data, hit } = await withCache({
				key: {
					scope: "listing-transaction-log:collection",
					version: "1",
					value: json,
				},
				fetch: () =>
					withCollection({
						select: withListingTransactionLogSelect({
							sort,
						}),
						output: ListingTransactionLogSchema,
						cursor: cursor ?? {
							page: 0,
							size: 10,
						},
						filter,
						where,
						query: withListingTransactionLogQueryBuilder,
					}),
			});

			return c.json(data, {
				headers: {
					"X-Cached": hit ? "true" : "false",
				},
			});
		},
	);
};
