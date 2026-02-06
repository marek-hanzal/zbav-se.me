import { createRoute, z } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { categoryFetchFx } from "~/@session/category/fx/categoryFetchFx";
import { CategoryQuerySchema } from "~/@session/category/schema/CategoryQuerySchema";
import { CategorySchema } from "~/@session/category/schema/CategorySchema";
import { KyselyContextLayer } from "~/database/context/KyselyContextLayer";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withCategoryFetchApiFx = Effect.fn("withCategoryFetchApiFx")(function* () {
	const { sessionHono } = yield* RoutesContextFx;

	sessionHono.openapi(
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
					description: "Return a category based on the provided query",
				},
				404: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Category not found",
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
			summary: "Fetch a category based on the provided query",
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json<CategorySchema.Type, 200>(
					yield* zodFx({
						schema: CategorySchema,
						dataFx: categoryFetchFx({
							...c.req.valid("json"),
							scope: {},
						}) satisfies Effect.Effect<CategorySchema.Type, any, any>,
					}),
					200,
				);
			}).pipe(
				Effect.provide(KyselyContextLayer(c.get("kysely"))),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{
									_tag: "NotFoundErrorFx",
								},
								() => c.json(NotFoundNotice, 404),
							),
							Match.when(
								{ _tag: "ZodErrorFx" },
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
