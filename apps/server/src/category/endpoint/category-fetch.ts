import { createRoute } from "@hono/zod-openapi";
import { withFetch } from "@use-pico/common/fetch";
import type { Routes } from "../../hono/Routes";
import { withCache } from "../../redis/withCache";
import { ErrorDtoSchema } from "../../schema/ErrorDtoSchema";
import { CategoryDtoSchema } from "../schema/CategoryDtoSchema";
import { CategoryQuerySchema } from "../schema/CategoryQuerySchema";
import { withCategoryQueryBuilder } from "../withCategoryQueryBuilder";
import { withCategorySelect } from "../withCategorySelect";

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
							schema: CategoryDtoSchema,
						},
					},
					description:
						"Return a category based on the provided query",
				},
				404: {
					content: {
						"application/json": {
							schema: ErrorDtoSchema,
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
						output: CategoryDtoSchema,
						filter,
						where,
						query: withCategoryQueryBuilder,
					}),
			});

			if (!data) {
				return c.json(
					{
						message: "Category not found",
					},
					404,
				);
			}

			return c.json(data, {
				status: 200,
				headers: {
					"X-Cached": hit ? "true" : "false",
				},
			});
		},
	);
};
