import { createRoute } from "@hono/zod-openapi";
import { withCollection } from "@use-pico/common/collection";
import type { Routes } from "../../hono/Routes";
import { withCache } from "../../redis/withCache";
import { withCollectionSchema } from "../../schema/withCollectionSchema";
import { ListingDtoSchema } from "../schema/ListingDtoSchema";
import { ListingQuerySchema } from "../schema/ListingQuerySchema";
import { withListingQueryBuilder } from "../withListingQueryBuilder";
import { withListingSelect } from "../withListingSelect";

export const withListingCollectionApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/listing/collection",
			description: "Returns listings based on provided parameters",
			operationId: "apiListingCollection",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingQuerySchema,
						},
					},
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: withCollectionSchema({
								schema: ListingDtoSchema,
								type: "ListingCollection",
								description: "Collection of listings",
							}),
						},
					},
					description:
						"Access collection of listings based on provided query",
				},
			},
			tags: [
				"listing",
				"session",
			],
		}),
		async (c) => {
			const json = c.req.valid("json");
			const { cursor, filter, where, sort, meta } = json;

			const { data, hit } = await withCache({
				key: {
					scope: "listing:collection",
					version: "1",
					value: json,
				},
				fetch: () =>
					withCollection({
						select: withListingSelect({
							sort,
							meta,
						}),
						output: ListingDtoSchema,
						cursor: cursor ?? {
							page: 0,
							size: 10,
						},
						filter,
						where,
						query: withListingQueryBuilder,
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
