import { createRoute } from "@hono/zod-openapi";
import { withCollection } from "@use-pico/common/collection";
import { withFetch } from "@use-pico/common/fetch";
import { FeedCollectionRequestSchema } from "../../@session/feed/schema/FeedCollectionRequestSchema";
import type { Routes } from "../../hono/Routes";
import { withCache } from "../../redis/withCache";
import { MessageSchema } from "../../schema/MessageSchema";
import { withCollectionSchema } from "../../schema/withCollectionSchema";
import { withFeedQueryBuilder } from "../feed/db/withFeedQueryBuilder";
import { withFeedSelect } from "../feed/db/withFeedSelect";
import { FeedSchema } from "../feed/schema/FeedSchema";
import { withListingQueryBuilder } from "./db/withListingQueryBuilder";
import { withListingSelect } from "./db/withListingSelect";
import { ListingSchema } from "./schema/ListingSchema";

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
								schema: ListingSchema,
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
							schema: MessageSchema,
						},
					},
					description: "Feed not found",
				},
				500: {
					content: {
						"application/json": {
							schema: MessageSchema,
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
			const user = c.get("user");
			const feed = await withFetch({
				select: withFeedSelect({
					sort: [],
				}),
				output: FeedSchema,
				where: {
					id: feedId,
				},
				query: withFeedQueryBuilder,
			});

			if (!feed) {
				return c.json<MessageSchema.Type, 404>(
					{
						type: "error",
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
						userId: user.id,
					},
				},
				fetch: () =>
					withCollection({
						select: withListingSelect({
							sort: feed.sort,
							meta: feed.meta,
							userId: user.id,
						}),
						output: ListingSchema,
						cursor: cursor ?? {
							page: 0,
							size: 10,
						},
						filter: feed.filter,
						query: withListingQueryBuilder,
					}),
			});

			return c.json<withCollectionSchema.Type<ListingSchema>, 200>(data, {
				status: 200,
				headers: {
					"X-Cached": hit ? "true" : "false",
				},
			});
		},
	);
};
