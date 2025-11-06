import { createRoute } from "@hono/zod-openapi";
import { withCollection } from "@use-pico/common/collection";
import type { Routes } from "../../hono/Routes";
import { withCache } from "../../redis/withCache";
import { withCollectionSchema } from "../../schema/withCollectionSchema";
import { withListingCartQueryBuilder } from "./db/withListingCartQueryBuilder";
import { withListingCartSelect } from "./db/withListingCartSelect";
import { ListingCartQuerySchema } from "./schema/ListingCartQuerySchema";
import { ListingCartSchema } from "./schema/ListingCartSchema";

export const withListingCartCollectionApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/listing-cart/collection",
			description:
				"Returns listing cart items based on provided parameters",
			operationId: "apiListingCartCollection",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingCartQuerySchema,
						},
					},
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: withCollectionSchema({
								schema: ListingCartSchema,
								type: "ListingCartCollection",
								description: "Collection of listing cart items",
							}),
						},
					},
					description:
						"Access collection of listing cart items based on provided query",
				},
			},
			tags: [
				"listing-cart",
				"session",
			],
		}),
		async (c) => {
			const json = c.req.valid("json");
			const user = c.get("user");
			const { cursor, filter, where, sort } = json;

			// Always filter by current user
			const userWhere = {
				...where,
				userId: user.id,
			};

			const { data, hit } = await withCache({
				key: {
					scope: "listing-cart:collection",
					version: "1",
					value: {
						...json,
						where: userWhere,
					},
				},
				fetch: () =>
					withCollection({
						select: withListingCartSelect({
							sort,
						}),
						output: ListingCartSchema,
						cursor: cursor ?? {
							page: 0,
							size: 10,
						},
						filter,
						where: userWhere,
						query: withListingCartQueryBuilder,
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
