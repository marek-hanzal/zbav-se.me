import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { categoryFetchFx } from "~/app/category/fx/categoryFetchFx";
import { CategoryQuerySchema } from "~/app/category/schema/CategoryQuerySchema";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { CategorySchema } from "./schema/CategorySchema";

export const withCategoryFetchApi: Routes.Fn = async ({ sessionHono }) => {
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
				"category",
				"session",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json<CategorySchema.Type, 200>(
					yield* categoryFetchFx(c.req.valid("json")),
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
									_tag: "NotFoundErrorFx",
								},
								() => {
									return c.json<NoticeSchema.Type, 404>(
										{
											type: "error",
											message: e.message,
										},
										404,
									);
								},
							),
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
