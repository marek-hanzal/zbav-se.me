import { createRoute } from "@hono/zod-openapi";
import { withCollection } from "@use-pico/common/collection";
import type { Routes } from "../../hono/Routes";
import { withCache } from "../../redis/withCache";
import { withCollectionSchema } from "../../schema/withCollectionSchema";
import { withListingIgnoreQueryBuilder } from "./db/withListingIgnoreQueryBuilder";
import { withListingIgnoreSelect } from "./db/withListingIgnoreSelect";
import { ListingIgnoreQuerySchema } from "./schema/ListingIgnoreQuerySchema";
import { ListingIgnoreSchema } from "./schema/ListingIgnoreSchema";

export const withListingIgnoreCollectionApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/listing-ignore/collection",
			description:
				"Returns listing ignore items based on provided parameters",
			operationId: "apiListingIgnoreCollection",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingIgnoreQuerySchema,
						},
					},
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: withCollectionSchema({
								schema: ListingIgnoreSchema,
								type: "ListingIgnoreCollection",
								description:
									"Collection of listing ignore items",
							}),
						},
					},
					description:
						"Access collection of listing ignore items based on provided query",
				},
			},
			tags: [
				"listing-ignore",
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
					scope: "listing-ignore:collection",
					version: "1",
					value: {
						...json,
						where: userWhere,
					},
				},
				fetch: () =>
					withCollection({
						select: withListingIgnoreSelect({
							sort,
						}),
						output: ListingIgnoreSchema,
						cursor: cursor ?? {
							page: 0,
							size: 10,
						},
						filter,
						where: userWhere,
						query: withListingIgnoreQueryBuilder,
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
