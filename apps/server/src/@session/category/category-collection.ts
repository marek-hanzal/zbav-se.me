import { createRoute } from "@hono/zod-openapi";
import { withCollection } from "@use-pico/common/collection";
import { genId } from "@use-pico/common/gen-id";
import { sql } from "kysely";
import { database } from "../../database/kysely";
import type { Routes } from "../../hono/Routes";
import { withCache } from "../../redis/withCache";
import { withCollectionSchema } from "../../schema/withCollectionSchema";
import { withCategoryQueryBuilder } from "./db/withCategoryQueryBuilder";
import { withCategorySelect } from "./db/withCategorySelect";
import { CategoryQuerySchema } from "./schema/CategoryQuerySchema";
import { CategorySchema } from "./schema/CategorySchema";

export const withCategoryCollectionApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
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
								schema: CategorySchema,
								type: "CategoryCollection",
								description: "Collection of categories",
							}),
						},
					},
					description: "Access collection of categories based on provided query",
				},
			},
			tags: [
				"category",
				"session",
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
						output: CategorySchema,
						cursor: cursor ?? {
							page: 0,
							size: 10,
						},
						filter,
						where,
						query: withCategoryQueryBuilder,
					}),
			});

			if (data.data.length === 0 && (where?.fulltext || filter?.fulltext)) {
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

			return c.json<withCollectionSchema.Type<CategorySchema>, 200>(data, {
				headers: {
					"X-Cached": hit ? "true" : "false",
				},
			});
		},
	);
};
