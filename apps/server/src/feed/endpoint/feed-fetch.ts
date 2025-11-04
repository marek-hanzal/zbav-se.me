import { createRoute } from "@hono/zod-openapi";
import { withFetch } from "@use-pico/common/fetch";
import type { Routes } from "../../hono/Routes";
import { withCache } from "../../redis/withCache";
import { ErrorDtoSchema } from "../../schema/ErrorDtoSchema";
import { FeedDtoSchema } from "../schema/FeedDtoSchema";
import { FeedQuerySchema } from "../schema/FeedQuerySchema";
import { withFeedQueryBuilder } from "../withFeedQueryBuilder";
import { withFeedSelect } from "../withFeedSelect";

export const withFeedFetchApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/feed/fetch",
			description: "Return a feed item based on the provided query",
			operationId: "apiFeedFetch",
			request: {
				body: {
					content: {
						"application/json": {
							schema: FeedQuerySchema,
						},
					},
					description: "Query object for feed fetch",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: FeedDtoSchema,
						},
					},
					description:
						"Return a feed item based on the provided query",
				},
				404: {
					content: {
						"application/json": {
							schema: ErrorDtoSchema,
						},
					},
					description: "Feed item not found",
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
			const { filter, where, sort } = json;

			const { data, hit } = await withCache({
				key: {
					scope: "feed:fetch",
					version: "1",
					value: {
						...json,
						userId: user.id,
					},
				},
				fetch: () =>
					withFetch({
						select: withFeedSelect({
							sort,
						}),
						output: FeedDtoSchema,
						filter,
						where: {
							...where,
							userId: user.id,
						},
						query: withFeedQueryBuilder,
					}),
			});

			if (!data) {
				return c.json(
					{
						message: "Feed item not found",
					},
					404,
				);
			}
			return c.json(data satisfies FeedDtoSchema.Type, {
				status: 200,
				headers: {
					"X-Cached": hit ? "true" : "false",
				},
			});
		},
	);
};
