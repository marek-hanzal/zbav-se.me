import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { withCount, withFetch, withList } from "@use-pico/common";
import { database } from "../database/kysely";
import { CountSchema } from "../schema/CountSchema";
import { CategoryGroupQuerySchema } from "./schema/CategoryGroupQuerySchema";
import { CategoryGroupSchema } from "./schema/CategoryGroupSchema";
import {
	withCategoryGroupQueryBuilder,
	withCategoryGroupQueryBuilderWithSort,
} from "./withCategoryGroupQueryBuilder";

export const categoryGroupRoot = new OpenAPIHono();

categoryGroupRoot.openapi(
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
	}),
	async ({ json, req }) => {
		const { filter, where, sort } = req.valid("json");
		return json(
			await withFetch({
				select: database.kysely.selectFrom("CategoryGroup").selectAll(),
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
		);
	},
);

categoryGroupRoot.openapi(
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
	}),
	async ({ json, req }) => {
		const { cursor, filter, where, sort } = req.valid("json");
		return json(
			await withList({
				select: database.kysely.selectFrom("CategoryGroup").selectAll(),
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
		);
	},
);

categoryGroupRoot.openapi(
	createRoute({
		method: "post",
		path: "/category-group/count",
		description: "Returns count of category groups based on provided query",
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
	}),
	async ({ json, req }) => {
		const { filter, where } = req.valid("json");
		return json(
			await withCount({
				select: database.kysely.selectFrom("CategoryGroup").selectAll(),
				filter,
				where,
				query({ select, where }) {
					return withCategoryGroupQueryBuilder({
						select,
						where,
					});
				},
			}),
		);
	},
);
