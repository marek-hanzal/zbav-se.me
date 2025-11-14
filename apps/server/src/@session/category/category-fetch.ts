import { createRoute } from "@hono/zod-openapi";
import { withFetch } from "@use-pico/common/fetch";
import type { Routes } from "../../hono/Routes";
import { withCache } from "../../redis/withCache";
import { MessageSchema } from "../../schema/MessageSchema";
import { withCategoryQueryBuilder } from "./db/withCategoryQueryBuilder";
import { withCategorySelect } from "./db/withCategorySelect";
import { CategoryQuerySchema } from "./schema/CategoryQuerySchema";
import { CategorySchema } from "./schema/CategorySchema";

export const withCategoryFetchApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/category/fetch",
			description: "Return a category based on the provided query",
			operationId: "apiCategoryFetch",
			request: {
				body: {
					content: {
						"application/json": {
							schema: CategoryQuerySchema,
						},
					},
					description: "Query object for category fetch",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: CategorySchema,
						},
					},
					description: "Return a category based on the provided query",
				},
				404: {
					content: {
						"application/json": {
							schema: MessageSchema,
						},
					},
					description: "Category not found",
				},
			},
			tags: [
				"category",
				"session",
			],
		}),
		async (c) => {
			const json = c.req.valid("json");
			const { filter, where, sort } = json;

			const { data, hit } = await withCache({
				key: {
					scope: "category:fetch",
					version: "1",
					value: json,
				},
				fetch: () =>
					withFetch({
						select: withCategorySelect({
							sort,
						}),
						output: CategorySchema,
						filter,
						where,
						query: withCategoryQueryBuilder,
					}),
			});

			if (!data) {
				return c.json<MessageSchema.Type, 404>(
					{
						type: "error",
						message: "Category not found",
					},
					404,
				);
			}

			return c.json<CategorySchema.Type, 200>(data, {
				status: 200,
				headers: {
					"X-Cached": hit ? "true" : "false",
				},
			});
		},
	);
};
