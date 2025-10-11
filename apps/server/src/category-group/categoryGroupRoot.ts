import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { CountSchema } from "../schema/CountSchema";
import { CategoryGroupQuerySchema } from "./schema/CategoryGroupQuerySchema";
import { CategoryGroupSchema } from "./schema/CategoryGroupSchema";

export const categoryGroupRoot = new OpenAPIHono();

categoryGroupRoot.openapi(
	createRoute({
		method: "post",
		path: "/category-group/collection",
		description: "Returns category groups based on provided parameters",
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
	(c) => {
		return c.json([]);
	},
);

categoryGroupRoot.openapi(
	createRoute({
		method: "post",
		path: "/category-group/count",
		description: "Returns count of category groups based on provided query",
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
	(c) => {
		return c.json({
			where: 0,
			filter: 0,
			total: 0,
		});
	},
);
