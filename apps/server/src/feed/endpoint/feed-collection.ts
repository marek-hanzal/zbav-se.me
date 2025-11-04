import { createRoute } from "@hono/zod-openapi";
import { withCollection } from "@use-pico/common/collection";
import type { Routes } from "../../hono/Routes";
import { withCache } from "../../redis/withCache";
import { withCollectionSchema } from "../../schema/withCollectionSchema";
import { FeedDtoSchema } from "../schema/FeedDtoSchema";
import { FeedQuerySchema } from "../schema/FeedQuerySchema";
import { withFeedQueryBuilder } from "../withFeedQueryBuilder";
import { withFeedSelect } from "../withFeedSelect";

export const withFeedCollectionApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/feed/collection",
			description: "Returns feed items based on provided parameters",
			operationId: "apiFeedCollection",
			request: {
				body: {
					content: {
						"application/json": {
							schema: FeedQuerySchema,
						},
					},
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: withCollectionSchema({
								schema: FeedDtoSchema,
								type: "FeedCollection",
								description: "Collection of feed items",
							}),
						},
					},
					description:
						"Access collection of feed items based on provided query",
				},
			},
			tags: [
				"feed",
				"session",
			],
		}),
		async (c) => {
			const json = c.req.valid("json");
			const user = c.get("user");
			const { cursor, filter, where, sort } = json;

			const { data, hit } = await withCache({
				key: {
					scope: "feed:collection",
					version: "1",
					value: {
						...json,
						userId: user.id,
					},
				},
				fetch: () =>
					withCollection({
						select: withFeedSelect({
							sort,
						}),
						output: FeedDtoSchema,
						cursor: cursor ?? {
							page: 0,
							size: 10,
						},
						filter,
						where: {
							...where,
							userId: user.id,
						},
						query: withFeedQueryBuilder,
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
