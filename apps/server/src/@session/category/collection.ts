import { createRoute } from "@hono/zod-openapi";
import { createDateContext, DateContextLayer } from "@use-pico/common/date";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { categoryCollectionFx } from "~/@session/category/fx/categoryCollectionFx";
import { CategoryItemSchema } from "~/@session/category/schema/CategoryItemSchema";
import { CategoryQuerySchema } from "~/@session/category/schema/CategoryQuerySchema";
import { KyselyContextLayer } from "~/database/context/KyselyContextLayer";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { withCollectionSchema } from "~/schema/withCollectionSchema";

const CollectionSchema = withCollectionSchema({
	schema: CategoryItemSchema,
	type: "CategoryItemSchema",
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
				"Category",
			],
			summary: "Fetch a collection of categories based on the provided query",
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json<withCollectionSchema.Type<CategoryItemSchema>, 200>(
					yield* zodFx({
						schema: CollectionSchema,
						dataFx: categoryCollectionFx({
							...c.req.valid("json"),
							scope: {},
						}) satisfies Effect.Effect<
							withCollectionSchema.Type<CategoryItemSchema>,
							any,
							any
						>,
					}),
					200,
				);
			}).pipe(
				Effect.provide(KyselyContextLayer(c.get("kysely"))),
				Effect.provide(DateContextLayer(createDateContext())),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{
									_tag: "ZodErrorFx",
								},
								({ zod }) => c.json(noticeZodError(zod), 500),
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
