import { createRoute, z } from "@hono/zod-openapi";
import { withCount, withFetch, withList } from "@use-pico/common";
import { database } from "../database/kysely";
import type { Routes } from "../hono/Routes";
import { withSessionHono } from "../hono/withSessionHono";
import { withCache } from "../redis/withCache";
import { CountSchema } from "../schema/CountSchema";
import { CategoryQuerySchema } from "./schema/CategoryQuerySchema";
import { CategorySchema } from "./schema/CategorySchema";
import {
	withCategoryQueryBuilder,
	withCategoryQueryBuilderWithSort,
} from "./withCategoryQueryBuilder";

export const withCategoryApi = ({ session }: Routes) => {
	const hono = withSessionHono();

	hono.openapi(
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
					description:
						"Return a category based on the provided query",
				},
			},
			tags: [
				"category",
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
						select: database.kysely
							.selectFrom("category")
							.selectAll(),
						output: CategorySchema,
						filter,
						where,
						query({ select, where }) {
							return withCategoryQueryBuilderWithSort({
								select,
								where,
								sort,
							});
						},
					}),
			});

			return c.json(data, {
				headers: {
					"X-Cached": hit ? "true" : "false",
				},
			});
		},
	);

	hono.openapi(
		createRoute({
			method: "post",
			path: "/category/collection",
			description: "Returns categories based on provided parameters",
			operationId: "apiCategoryCollection",
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
							schema: z.array(CategorySchema),
						},
					},
					description:
						"Access collection of categories based on provided query",
				},
			},
			tags: [
				"category",
			],
		}),
		async (c) => {
			const json = c.req.valid("json");
			const { cursor, filter, where, sort } = json;

			const { data, hit } = await withCache({
				key: {
					scope: "category:collection",
					version: "1",
					value: json,
				},
				fetch: () =>
					withList({
						select: database.kysely
							.selectFrom("category")
							.selectAll(),
						output: CategorySchema,
						cursor,
						filter,
						where,
						query({ select, where }) {
							return withCategoryQueryBuilderWithSort({
								select,
								where,
								sort,
							});
						},
					}),
			});

			return c.json(data, {
				headers: {
					"X-Cached": hit ? "true" : "false",
				},
			});
		},
	);

	hono.openapi(
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
						select: database.kysely
							.selectFrom("category")
							.selectAll(),
						filter,
						where,
						query({ select, where }) {
							return withCategoryQueryBuilder({
								select,
								where,
							});
						},
					}),
			});

			return c.json(data, {
				headers: {
					"X-Cached": hit ? "true" : "false",
				},
			});
		},
	);

	session.route("/", hono);
};
