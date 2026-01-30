import { createRoute, z } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { boardItemsFx } from "~/@arkini/board/fx/boardItemsFx";
import { ItemSchema } from "~/@arkini/schema/ItemSchema";
import { KyselyContextLayer } from "~/database/context/KyselyContextLayer";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withItemsApiFx = Effect.fn("withItemsApiFx")(function* () {
	const { arkiniHono } = yield* RoutesContextFx;
	arkiniHono.openapi(
		createRoute({
			method: "get",
			path: "/board/items",
			description: "Return current items on the board.",
			operationId: "apiBoardItems",
			request: {},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: z.array(ItemSchema),
						},
					},
					description: "Items on the board",
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
			tags: ["Board"],
			summary: "Return current items on the board.",
		}),
		async (c) => {
			const user = c.get("user");

			return Effect.gen(function* () {
				return c.json<ItemSchema.Type[], 200>(
					yield* zodFx({
						schema: z.array(ItemSchema),
						dataFx: boardItemsFx({ userId: user.id }),
					}),
					200,
				);
			}).pipe(
				Effect.provide(KyselyContextLayer(c.get("kysely"))),
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{ _tag: "ZodErrorFx" },
								({ zod }) =>
									c.json<NoticeSchema.Type, 500>(
										{ type: "error", message: z.prettifyError(zod) },
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
