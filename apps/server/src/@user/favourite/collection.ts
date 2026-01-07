import { createRoute } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { favouriteCollectionFx } from "~/app/favourite/fx/favouriteCollectionFx";
import { FavouriteQuerySchema } from "~/app/favourite/schema/FavouriteQuerySchema";
import { RoutesContextFx } from "~/app/routes/RoutesContextFx";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { withCollectionSchema } from "~/schema/withCollectionSchema";
import { FavouriteSchema } from "./schema/FavouriteSchema";

const CollectionSchema = withCollectionSchema({
	schema: FavouriteSchema,
	type: "FavouriteCollection",
	description: "Collection of favourite items",
});

export const withCollectionApiFx = Effect.fn("withCollectionApiFx")(function* () {
	const { userHono } = yield* RoutesContextFx;

	userHono.openapi(
		createRoute({
			method: "post",
			path: "/favourite/collection",
			description: "Returns favourite items based on provided parameters",
			operationId: "apiFavouriteCollection",
			request: {
				body: {
					content: {
						"application/json": {
							schema: FavouriteQuerySchema,
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
					description: "Access collection of favourite items based on provided query",
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
				"favourite",
				"user",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = c.get("user");

				return c.json<withCollectionSchema.Type<FavouriteSchema>, 200>(
					yield* zodFx({
						schema: CollectionSchema,
						dataFx: favouriteCollectionFx({
							...c.req.valid("json"),
							scope: {
								userId: user.id,
							},
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
});
