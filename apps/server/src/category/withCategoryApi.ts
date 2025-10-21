import { createRoute, z } from "@hono/zod-openapi";
import { withCount, withFetch, withList } from "@use-pico/common";
import { database } from "../database/kysely";
import type { Routes } from "../hono/Routes";
import { withSessionHono } from "../hono/withSessionHono";
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
		async ({ json, req }) => {
			const { filter, where, sort } = req.valid("json");

			return json(
				await withFetch({
					select: database.kysely.selectFrom("category").selectAll(),
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
			);
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
		async ({ json, req }) => {
			const { cursor, filter, where, sort } = req.valid("json");
			return json(
				await withList({
					select: database.kysely.selectFrom("category").selectAll(),
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
			);
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
		async ({ json, req }) => {
			const { filter, where } = req.valid("json");
			return json(
				await withCount({
					select: database.kysely.selectFrom("category").selectAll(),
					filter,
					where,
					query({ select, where }) {
						return withCategoryQueryBuilder({
							select,
							where,
						});
					},
				}),
			);
		},
	);

	session.route("/", hono);
};
