import { createRoute } from "@hono/zod-openapi";
import { withCollection } from "@use-pico/common/collection";
import type { Routes } from "../../hono/Routes";
import { withCache } from "../../redis/withCache";
import { withCollectionSchema } from "../../schema/withCollectionSchema";
import { withListingFlagQueryBuilder } from "./db/withListingFlagQueryBuilder";
import { withListingFlagSelect } from "./db/withListingFlagSelect";
import { ListingFlagQuerySchema } from "./schema/ListingFlagQuerySchema";
import { ListingFlagSchema } from "./schema/ListingFlagSchema";

export const withListingFlagCollectionApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/listing-flag/collection",
			description: "Returns listing flag items based on provided parameters",
			operationId: "apiListingFlagCollection",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingFlagQuerySchema,
						},
					},
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: withCollectionSchema({
								schema: ListingFlagSchema,
								type: "ListingFlagCollection",
								description: "Collection of listing flag items",
							}),
						},
					},
					description: "Access collection of listing flag items based on provided query",
				},
			},
			tags: [
				"listing-flag",
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
					scope: "listing-flag:collection",
					version: "1",
					value: {
						...json,
						where: userWhere,
					},
				},
				fetch: () =>
					withCollection({
						select: withListingFlagSelect({
							sort,
						}),
						output: ListingFlagSchema,
						cursor: cursor ?? {
							page: 0,
							size: 10,
						},
						filter,
						where: userWhere,
						query: withListingFlagQueryBuilder,
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
