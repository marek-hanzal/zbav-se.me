import { createRoute, z } from "@hono/zod-openapi";
import { withCount, withFetch, withList } from "@use-pico/common";
import { database } from "../database/kysely";
import type { Routes } from "../hono/Routes";
import { withSessionHono } from "../hono/withSessionHono";
import { redis } from "../redis/redis";
import { CountSchema } from "../schema/CountSchema";
import { CategoryGroupQuerySchema } from "./schema/CategoryGroupQuerySchema";
import { CategoryGroupSchema } from "./schema/CategoryGroupSchema";
import {
	withCategoryGroupQueryBuilder,
	withCategoryGroupQueryBuilderWithSort,
} from "./withCategoryGroupQueryBuilder";

export const withCategoryGroupApi = ({ session }: Routes) => {
	const hono = withSessionHono();

	hono.openapi(
		createRoute({
			method: "post",
			path: "/category-group/fetch",
			description: "Return a category group based on the provided query",
			operationId: "apiCategoryGroupFetch",
			request: {
				body: {
					content: {
						"application/json": {
							schema: CategoryGroupQuerySchema,
						},
					},
					description: "Query object for category group fetch",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: CategoryGroupSchema,
						},
					},
					description:
						"Return a category group based on the provided query",
				},
			},
			tags: [
				"category-group",
			],
		}),
		async (c) => {
			const json = c.req.valid("json");
			const { filter, where, sort } = json;

			const key = JSON.stringify(json);
			const cached = await redis.get<CategoryGroupSchema.Type>(key);
			if (cached) {
				return c.json(cached, {
					headers: {
						"X-Cached": "true",
					},
				});
			}

			return c.json(
				await withFetch({
					select: database.kysely
						.selectFrom("category_group")
						.selectAll(),
					output: CategoryGroupSchema,
					filter,
					where,
					query({ select, where }) {
						return withCategoryGroupQueryBuilderWithSort({
							select,
							where,
							sort,
						});
					},
				}),
				{
					headers: {
						"X-Cached": "false",
					},
				},
			);
		},
	);

	hono.openapi(
		createRoute({
			method: "post",
			path: "/category-group/collection",
			description: "Returns category groups based on provided parameters",
			operationId: "apiCategoryGroupCollection",
			request: {
				body: {
					content: {
						"application/json": {
							schema: CategoryGroupQuerySchema,
						},
					},
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: z.array(CategoryGroupSchema),
						},
					},
					description:
						"Access collection of category groups based on provided query",
				},
			},
			tags: [
				"category-group",
			],
		}),
		async (c) => {
			const json = c.req.valid("json");
			const { cursor, filter, where, sort } = json;

			const key = JSON.stringify(json);
			const cached = await redis.get<CategoryGroupSchema.Type[]>(key);

			if (cached) {
				return c.json(cached, {
					headers: {
						"X-Cached": "true",
					},
				});
			}

			const list = await withList({
				select: database.kysely
					.selectFrom("category_group")
					.selectAll(),
				output: CategoryGroupSchema,
				cursor,
				filter,
				where,
				query({ select, where }) {
					return withCategoryGroupQueryBuilderWithSort({
						select,
						where,
						sort,
					});
				},
			});

			redis.set(key, list);

			return c.json(list, {
				headers: {
					"X-Cached": "false",
				},
			});
		},
	);

	hono.openapi(
		createRoute({
			method: "post",
			path: "/category-group/count",
			description:
				"Returns count of category groups based on provided query",
			operationId: "apiCategoryGroupCount",
			request: {
				body: {
					content: {
						"application/json": {
							schema: CategoryGroupQuerySchema,
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
				"category-group",
			],
		}),
		async (c) => {
			const json = c.req.valid("json");
			const { filter, where } = json;

			const key = JSON.stringify(json);
			const cached = await redis.get<CountSchema.Type>(key);
			if (cached) {
				return c.json(cached, {
					headers: {
						"X-Cached": "true",
					},
				});
			}

			const count = await withCount({
				select: database.kysely
					.selectFrom("category_group")
					.selectAll(),
				filter,
				where,
				query({ select, where }) {
					return withCategoryGroupQueryBuilder({
						select,
						where,
					});
				},
			});

			redis.set(key, count);

			return c.json(count, {
				headers: {
					"X-Cached": "false",
				},
			});
		},
	);

	session.route("/", hono);
};
