import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { categoryCollectionFx } from "~/app/category/fx/categoryCollectionFx";
import { CategoryQuerySchema } from "~/app/category/schema/CategoryQuerySchema";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { withCollectionSchema } from "~/schema/withCollectionSchema";
import { CategorySchema } from "./schema/CategorySchema";
import { zodFx } from "@use-pico/common/schema";

const CollectionSchema = withCollectionSchema({
	schema: CategorySchema,
	type: "CategoryCollection",
	description: "Collection of categories",
});

export const withCategoryCollectionApi: Routes.Fn = async ({ sessionHono }) => {
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
							schema: CollectionSchema,
						},
					},
					description: "Access collection of categories based on provided query",
				},
				500: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Internal server error",
				},
			},
			tags: [
				"category",
				"session",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json<withCollectionSchema.Type<CategorySchema>, 200>(
					yield* zodFx({
						schema: CollectionSchema,
						dataFx: categoryCollectionFx({
							...c.req.valid("json"),
							scope: {},
						}),
					}),
					200,
				);
			}).pipe(
				DatabaseContextProvider(c.get("database")),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{
									_tag: "ZodErrorFx",
								},
								() => {
									return c.json<NoticeSchema.Type, 500>(
										{
											type: "error",
											message: e.message,
										},
										500,
									);
								},
							),
							Match.exhaustive,
						),
					);
				}),
				Effect.runPromise,
			);
		},
	);
};
