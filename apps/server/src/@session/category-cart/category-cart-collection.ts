import { createRoute } from "@hono/zod-openapi";
import { withCollection } from "@use-pico/common/collection";
import type { Routes } from "../../hono/Routes";
import { withCache } from "../../redis/withCache";
import { withCollectionSchema } from "../../schema/withCollectionSchema";
import { withCategoryQueryBuilder } from "../category/db/withCategoryQueryBuilder";
import { withCategoryCartSelect } from "./db/withCategoryCartSelect";
import { CategoryCartQuerySchema } from "./schema/CategoryCartQuerySchema";
import { CategoryCartSchema } from "./schema/CategoryCartSchema";

export const withCategoryCartCollectionApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/category-cart/collection",
			description: "Returns categories for listings saved in the current user's cart",
			operationId: "apiCategoryCartCollection",
			request: {
				body: {
					content: {
						"application/json": {
							schema: CategoryCartQuerySchema,
						},
					},
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: withCollectionSchema({
								schema: CategoryCartSchema,
								type: "CategoryCartCollection",
								description:
									"Collection of categories represented in the user's cart",
							}),
						},
					},
					description: "Access categories for listings stored in the user's cart",
				},
			},
			tags: [
				"category-cart",
				"session",
			],
		}),
		async (c) => {
			const json = c.req.valid("json");
			const user = c.get("user");
			const { cursor, filter, where, sort } = json;

			const { data, hit } = await withCache({
				key: {
					scope: "category-cart:collection",
					version: "1",
					value: {
						...json,
						userId: user.id,
					},
				},
				fetch: () => {
					return withCollection({
						select: withCategoryCartSelect({
							sort,
							userId: user.id,
						}),
						output: CategoryCartSchema,
						cursor: cursor ?? {
							page: 0,
							size: 10,
						},
						filter,
						where,
						query: withCategoryQueryBuilder,
					});
				},
			});

			return c.json<withCollectionSchema.Type<CategoryCartSchema>, 200>(data, {
				headers: {
					"X-Cached": hit ? "true" : "false",
				},
			});
		},
	);
};
