import { createRoute } from "@hono/zod-openapi";
import { withCollection } from "@use-pico/common/collection";
import { withCount } from "@use-pico/common/count";
import { withFetch } from "@use-pico/common/fetch";
import { genId } from "@use-pico/common/gen-id";
import { sql } from "kysely";
import { database } from "../database/kysely";
import type { Routes } from "../hono/Routes";
import { withSessionHono } from "../hono/withSessionHono";
import { withCache } from "../redis/withCache";
import { CountSchema } from "../schema/CountSchema";
import { ErrorDtoSchema } from "../schema/ErrorDtoSchema";
import { withCollectionSchema } from "../schema/withCollectionSchema";
import { CategoryDtoSchema } from "./schema/CategoryDtoSchema";
import { CategoryQuerySchema } from "./schema/CategoryQuerySchema";
import { withCategoryQueryBuilder } from "./withCategoryQueryBuilder";
import { withCategorySelect } from "./withCategorySelect";

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
							schema: withCollectionSchema({
								schema: CategoryDtoSchema,
								type: "CategoryCollection",
								description: "Collection of categories",
							}),
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
					withCollection({
						select: withCategorySelect({
							sort,
						}),
						output: CategoryDtoSchema,
						cursor: cursor ?? {
							page: 0,
							size: 10,
						},
						filter,
						where,
						query: withCategoryQueryBuilder,
					}),
			});

			if (
				data.data.length === 0 &&
				(where?.fulltext || filter?.fulltext)
			) {
				const fulltext = filter?.fulltext || where?.fulltext;
				if (fulltext && fulltext.length >= 4) {
					try {
						await database.kysely
							.insertInto("category_miss")
							.values({
								id: genId(),
								category: fulltext,
								count: 1,
								updatedAt: new Date(),
							})
							.onConflict((oc) =>
								oc
									.columns([
										"category",
									])
									.doUpdateSet({
										count: sql`category_miss.count + 1`,
										updatedAt: new Date(),
									}),
							)
							.execute();
					} catch (error) {
						console.error("Failed to track category miss:", error);
					}
				}
			}

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

	session.route("/", hono);
};
