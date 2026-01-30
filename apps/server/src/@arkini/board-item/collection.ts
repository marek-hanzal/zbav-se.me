import { createRoute, z } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { boardItemCollectionFx } from "~/@arkini/board-item/fx/boardItemCollectionFx";
import { BoardItemItemSchema } from "~/@arkini/board-item/schema/BoardItemItemSchema";
import { BoardItemQuerySchema } from "~/@arkini/board-item/schema/BoardItemQuerySchema";
import { KyselyContextLayer } from "~/database/context/KyselyContextLayer";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { withCollectionSchema } from "~/schema/withCollectionSchema";

const CollectionSchema = withCollectionSchema({
	schema: BoardItemItemSchema,
	type: "BoardItemCollection",
	description: "Collection of board items",
});

export const withCollectionApiFx = Effect.fn("withCollectionApiFx")(function* () {
	const { arkiniHono } = yield* RoutesContextFx;
	arkiniHono.openapi(
		createRoute({
			method: "post",
			path: "/board-item/collection",
			description: "Returns board items based on provided parameters",
			operationId: "apiBoardItemCollection",
			request: {
				body: {
					content: {
						"application/json": {
							schema: BoardItemQuerySchema,
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
					description: "Access collection of board items based on provided query",
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
				"Board Item",
			],
			summary: "Fetch a collection of board items based on the provided query",
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = c.get("user");

				return c.json<withCollectionSchema.Type<BoardItemItemSchema>, 200>(
					yield* zodFx({
						schema: CollectionSchema,
						dataFx: boardItemCollectionFx({
							...c.req.valid("json"),
							scope: {
								userId: user.id,
							},
						}) satisfies Effect.Effect<
							withCollectionSchema.Type<BoardItemItemSchema>,
							any,
							any
						>,
					}),
					200,
				);
			}).pipe(
				Effect.provide(KyselyContextLayer(c.get("kysely"))),
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{
									_tag: "ZodErrorFx",
								},
								({ zod }) =>
									c.json<NoticeSchema.Type, 500>(
										{
											type: "error",
											message: z.prettifyError(zod),
										},
										500,
									),
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
