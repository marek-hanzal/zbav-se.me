import { createRoute, z } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { categoryCollectionFx } from "~/app/category/fx/categoryCollectionFx";
import { CategoryQuerySchema } from "~/app/category/schema/CategoryQuerySchema";
import { RoutesContextFx } from "~/app/routes/RoutesContextFx";
import { KyselyContextProvider } from "~/database/context/KyselyContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { withCollectionSchema } from "~/schema/withCollectionSchema";
import { CategorySchema } from "./schema/CategorySchema";

const CollectionSchema = withCollectionSchema({
	schema: CategorySchema,
	type: "CategoryCollection",
	description: "Collection of categories",
});

export const withCategoryCollectionApiFx = Effect.fn("withCategoryCollectionApiFx")(function* () {
	const { sessionHono } = yield* RoutesContextFx;

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
				KyselyContextProvider(c.get("kysely")),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{
									_tag: "ZodErrorFx",
								},
								({ zod }) => {
									return c.json<NoticeSchema.Type, 500>(
										{
											type: "error",
											message: z.prettifyError(zod),
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
});
