import { createRoute } from "@hono/zod-openapi";
import { withCount } from "@use-pico/common/count";
import type { Routes } from "../../hono/Routes";
import { withCache } from "../../redis/withCache";
import { CountSchema } from "../../schema/CountSchema";
import { withFeedQueryBuilder } from "./db/withFeedQueryBuilder";
import { withFeedSelect } from "./db/withFeedSelect";
import { FeedQuerySchema } from "./schema/FeedQuerySchema";

export const withFeedCountApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/feed/count",
			description:
				"Returns count of feed items based on provided query (user-specific)",
			operationId: "apiFeedCount",
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
							schema: CountSchema,
						},
					},
					description: "Return counts based on provided query",
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
			const { filter, where } = json;

			const { data, hit } = await withCache({
				key: {
					scope: "feed:count",
					version: "1",
					value: {
						...json,
						userId: user.id,
					},
				},
				fetch: () =>
					withCount({
						select: withFeedSelect({
							sort: [],
						}),
						filter,
						where: {
							...where,
							userId: user.id,
						},
						query: withFeedQueryBuilder,
					}),
			});

			return c.json<CountSchema.Type, 200>(data, {
				headers: {
					"X-Cached": hit ? "true" : "false",
				},
			});
		},
	);
};
