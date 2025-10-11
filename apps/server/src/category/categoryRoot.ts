import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { CountSchema } from "../schema/CountSchema";
import { CategoryQuerySchema } from "./schema/CategoryQuerySchema";
import { CategorySchema } from "./schema/CategorySchema";

export const categoryRoot = new OpenAPIHono();

categoryRoot.openapi(
	createRoute({
		method: "post",
		path: "/category/fetch",
		description: "Return a category based on the provided query",
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
		},
	}),
	(c) => {
		return c.json({
			id: "1",
			name: "Category 1",
			sort: 1,
			categoryGroupId: "1",
		});
	},
);

categoryRoot.openapi(
	createRoute({
		method: "post",
		path: "/category/collection",
		description: "Returns categories based on provided parameters",
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
	}),
	(c) => {
		return c.json([]);
	},
);

categoryRoot.openapi(
	createRoute({
		method: "post",
		path: "/category/count",
		description: "Returns count of categories based on provided query",
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
	}),
	(c) => {
		return c.json({
			where: 0,
			filter: 0,
			total: 0,
		});
	},
);
