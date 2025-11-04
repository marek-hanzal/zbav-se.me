import { createRoute } from "@hono/zod-openapi";
import { withCollection } from "@use-pico/common/collection";
import { withFetch } from "@use-pico/common/fetch";
import { FeedCollectionRequestSchema } from "../../feed/schema/FeedCollectionRequestSchema";
import { FeedDtoSchema } from "../../feed/schema/FeedDtoSchema";
import { withFeedQueryBuilder } from "../../feed/withFeedQueryBuilder";
import { withFeedSelect } from "../../feed/withFeedSelect";
import type { Routes } from "../../hono/Routes";
import { withCache } from "../../redis/withCache";
import { ErrorDtoSchema } from "../../schema/ErrorDtoSchema";
import { withCollectionSchema } from "../../schema/withCollectionSchema";
import { ListingDtoSchema } from "../schema/ListingDtoSchema";
import { withListingQueryBuilder } from "../withListingQueryBuilder";
import { withListingSelect } from "../withListingSelect";

export const withListingFeedCollectionApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/listing/feed/collection",
			description:
				"Returns listings based on filter/sort stored in a feed (by id)",
			operationId: "apiListingFeedCollection",
			request: {
				body: {
					content: {
						"application/json": {
							schema: FeedCollectionRequestSchema,
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
						"Access collection of listings based on a feed definition",
				},
				404: {
					content: {
						"application/json": {
							schema: ErrorDtoSchema,
						},
					},
					description: "Feed not found",
				},
				500: {
					content: {
						"application/json": {
							schema: ErrorDtoSchema,
						},
					},
					description: "Internal server error",
				},
			},
			tags: [
				"listing",
				"session",
			],
		}),
		async (c) => {
			const { feedId, cursor } = c.req.valid("json");
			const feed = await withFetch({
				select: withFeedSelect({
					sort: [],
				}),
				output: FeedDtoSchema,
				where: {
					id: feedId,
				},
				query: withFeedQueryBuilder,
			});

			if (!feed) {
				return c.json(
					{
						message: "Feed item not found",
					},
					404,
				);
			}

			const { data, hit } = await withCache({
				key: {
					scope: "listing:feed:collection",
					version: "1",
					value: {
						feedId,
						cursor,
						filter: feed.filter,
						sort: feed.sort,
					},
				},
				fetch: () =>
					withCollection({
						select: withListingSelect({
							sort: feed.sort,
							meta: feed.meta,
						}),
						output: ListingDtoSchema,
						cursor: cursor ?? {
							page: 0,
							size: 10,
						},
						filter: feed.filter,
						query: withListingQueryBuilder,
					}),
			});

			return c.json(data, {
				status: 200,
				headers: {
					"X-Cached": hit ? "true" : "false",
				},
			});
		},
	);
};
