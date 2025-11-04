import { createRoute } from "@hono/zod-openapi";
import { withCount } from "@use-pico/common/count";
import type { Routes } from "../../hono/Routes";
import { withCache } from "../../redis/withCache";
import { CountSchema } from "../../schema/CountSchema";
import { CategoryQuerySchema } from "../schema/CategoryQuerySchema";
import { withCategoryQueryBuilder } from "../withCategoryQueryBuilder";
import { withCategorySelect } from "../withCategorySelect";

export const withCategoryCountApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/category/count",
			description: "Returns count of categories based on provided query",
			operationId: "apiCategoryCount",
			request: {
				body: {
					content: {
						"application/json": {
							schema: CategoryQuerySchema,
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
				"category",
				"session",
			],
		}),
		async (c) => {
			const json = c.req.valid("json");
			const { filter, where } = json;

			const { data, hit } = await withCache({
				key: {
					scope: "category:count",
					version: "1",
					value: json,
				},
				fetch: () =>
					withCount({
						select: withCategorySelect(),
						filter,
						where,
						query: withCategoryQueryBuilder,
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
