import { createRoute } from "@hono/zod-openapi";
import { withCollection } from "@use-pico/common/collection";
import type { Routes } from "../../hono/Routes";
import { withCache } from "../../redis/withCache";
import { withCollectionSchema } from "../../schema/withCollectionSchema";
import { withListingScoreQueryBuilder } from "./db/withListingScoreQueryBuilder";
import { withListingScoreSelect } from "./db/withListingScoreSelect";
import { ListingScoreQuerySchema } from "./schema/ListingScoreQuerySchema";
import { ListingScoreSchema } from "./schema/ListingScoreSchema";

export const withListingScoreCollectionApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/listing-score/collection",
			description: "Returns listing scores based on provided parameters",
			operationId: "apiListingScoreCollection",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingScoreQuerySchema,
						},
					},
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: withCollectionSchema({
								schema: ListingScoreSchema,
								type: "ListingScoreCollection",
								description: "Collection of listing scores",
							}),
						},
					},
					description: "Access collection of listing scores based on provided query",
				},
			},
			tags: [
				"listing-score",
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
					scope: "listing-score:collection",
					version: "1",
					value: {
						...json,
						where: userWhere,
					},
				},
				fetch: () =>
					withCollection({
						select: withListingScoreSelect({
							sort,
						}),
						output: ListingScoreSchema,
						cursor: cursor ?? {
							page: 0,
							size: 10,
						},
						filter,
						where: userWhere,
						query: withListingScoreQueryBuilder,
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
