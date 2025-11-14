import { createRoute } from "@hono/zod-openapi";
import { withCollection } from "@use-pico/common/collection";
import type { Routes } from "../../hono/Routes";
import { withCache } from "../../redis/withCache";
import { withCollectionSchema } from "../../schema/withCollectionSchema";
import { withListingTransactionQueryBuilder } from "./db/withListingTransactionQueryBuilder";
import { withListingTransactionSelect } from "./db/withListingTransactionSelect";
import { ListingTransactionQuerySchema } from "./schema/ListingTransactionQuerySchema";
import { ListingTransactionSchema } from "./schema/ListingTransactionSchema";

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
			},
			tags: [
				"listing-transaction",
				"session",
			],
		}),
		async (c) => {
			const json = c.req.valid("json");
			const user = c.get("user");
			const { cursor, filter, where, sort } = json;

			const userWhere = {
				...where,
				userId: user.id,
			};

			const { data, hit } = await withCache({
				key: {
					scope: "listing-transaction:collection",
					version: "1",
					value: {
						...json,
						where: userWhere,
					},
				},
				fetch: () =>
					withCollection({
						select: withListingTransactionSelect({
							sort,
						}),
						output: ListingTransactionSchema,
						cursor: cursor ?? {
							page: 0,
							size: 10,
						},
						filter,
						where: userWhere,
						query: withListingTransactionQueryBuilder,
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
