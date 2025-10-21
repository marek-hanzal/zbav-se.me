import { createRoute, z } from "@hono/zod-openapi";
import { withCount, withFetch, withList } from "@use-pico/common";
import { database } from "../database/kysely";
import type { Routes } from "../hono/Routes";
import { withSessionHono } from "../hono/withSessionHono";
import { withCache } from "../redis/withCache";
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

			const { data, hit } = await withCache({
				key: {
					scope: "category-group:fetch",
					version: "1",
					value: json,
				},
				fetch: () =>
					withFetch({
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

			const { data, hit } = await withCache({
				key: {
					scope: "category-group:collection",
					version: "1",
					value: json,
				},
				fetch: () =>
					withList({
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

			const { data, hit } = await withCache({
				key: {
					scope: "category-group:count",
					version: "1",
					value: json,
				},
				fetch: () =>
					withCount({
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
