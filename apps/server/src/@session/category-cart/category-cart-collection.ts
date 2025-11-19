import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { UserContextProvider } from "../../auth/fx/UserContextFx";
import { DatabaseContextProvider } from "../../database/fx/DatabaseContextFx";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { withCollectionSchema } from "../../schema/withCollectionSchema";
import { categoryCartCollectionFx } from "./fx/categoryCartCollectionFx";
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
				500: {
					content: {
						"application/json": {
							schema: MessageSchema,
						},
					},
					description: "Internal server error",
				},
			},
			tags: [
				"category-cart",
				"session",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json<withCollectionSchema.Type<CategoryCartSchema>, 200>(
					yield* categoryCartCollectionFx({
						query: c.req.valid("json"),
					}),
					200,
				);
			}).pipe(
				DatabaseContextProvider(c.get("database")),
				UserContextProvider(c.get("user")),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{
									_tag: "UnknownException",
								},
								() => {
									return c.json<MessageSchema.Type, 500>(
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
