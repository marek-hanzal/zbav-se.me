import { createRoute, z } from "@hono/zod-openapi";
import { createDateContext, DateContextLayer } from "@use-pico/common/date";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { boardItemsFx } from "~/@arkini/board/fx/boardItemsFx";
import { BoardItemSchema } from "~/@arkini/board/schema/BoardItemSchema";
import { KyselyContextLayer } from "~/database/context/KyselyContextLayer";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withItemsApiFx = Effect.fn("withItemsApiFx")(function* () {
	const { arkiniHono } = yield* RoutesContextFx;
	arkiniHono.openapi(
		createRoute({
			method: "post",
			path: "/board/items",
			description: "Returns all items on the user's board",
			operationId: "apiBoardItems",
			request: {},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: z.array(BoardItemSchema),
						},
					},
					description: "Board items",
				},
				404: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Board not found",
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
				"Board",
			],
			summary: "Get board items",
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = c.get("user");

				return c.json<BoardItemSchema.Type[], 200>(
					yield* zodFx({
						schema: z.array(BoardItemSchema),
						dataFx: boardItemsFx({
							userId: user.id,
						}) satisfies Effect.Effect<BoardItemSchema.Type[], any, any>,
					}),
					200,
				);
			}).pipe(
				Effect.provide(DateContextLayer(createDateContext())),
				Effect.provide(KyselyContextLayer(c.get("kysely"))),
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{
									_tag: "NotFoundErrorFx",
								},
								(err) =>
									c.json<NoticeSchema.Type, 404>(
										{
											type: "error",
											message: err.message,
										},
										404,
									),
							),
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
