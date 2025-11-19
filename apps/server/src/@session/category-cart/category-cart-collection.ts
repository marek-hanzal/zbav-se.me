import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { withCollectionSchema } from "../../schema/withCollectionSchema";
import { CategoryCartQuerySchema } from "./schema/CategoryCartQuerySchema";
import { CategoryCartSchema } from "./schema/CategoryCartSchema";
import { categoryCartCollectionFx } from "./service/categoryCartCollectionFx";

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
						database: c.get("database"),
						userId: c.get("user").id,
						query: c.req.valid("json"),
					}),
					200,
				);
			}).pipe(
				Effect.catchAll((e) => {
					/**
					 * This just holds type exhaustive match for errors if any comes up.
					 */
					Match.value(e).pipe(Match.exhaustive);

					return Effect.succeed(
						c.json<MessageSchema.Type, 500>(
							{
								type: "error",
								message: "This should not happen",
							},
							500,
						),
					);
				}),
				Effect.runPromise,
			);
		},
	);
};
