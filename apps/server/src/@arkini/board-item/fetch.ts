import { createRoute, z } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { boardItemFetchFx } from "~/@arkini/board-item/fx/boardItemFetchFx";
import { BoardItemQuerySchema } from "~/@arkini/board-item/schema/BoardItemQuerySchema";
import { BoardItemSchema } from "~/@arkini/board-item/schema/BoardItemSchema";
import { KyselyContextLayer } from "~/database/context/KyselyContextLayer";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withFetchApiFx = Effect.fn("withFetchApiFx")(function* () {
	const { arkiniHono } = yield* RoutesContextFx;
	arkiniHono.openapi(
		createRoute({
			method: "post",
			path: "/board-item/fetch",
			description: "Return a board item based on the provided query",
			operationId: "apiBoardItemFetch",
			request: {
				body: {
					content: {
						"application/json": {
							schema: BoardItemQuerySchema,
						},
					},
					description: "Query object for board item fetch",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: BoardItemSchema,
						},
					},
					description: "Board item",
				},
				404: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Board item not found",
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
			tags: ["Board Item"],
			summary: "Fetch a board item based on the provided query",
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = c.get("user");

				return c.json<BoardItemSchema.Type, 200>(
					yield* zodFx({
						schema: BoardItemSchema,
						dataFx: boardItemFetchFx({
							...c.req.valid("json"),
							scope: {
								userId: user.id,
							},
						}) satisfies Effect.Effect<BoardItemSchema.Type, any, any>,
					}),
					200,
				);
			}).pipe(
				Effect.provide(KyselyContextLayer(c.get("kysely"))),
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{ _tag: "NotFoundErrorFx" },
								() =>
									c.json<NoticeSchema.Type, 404>(
										{ type: "error", message: (e as { message: string }).message },
										404,
									),
							),
							Match.when(
								{ _tag: "ZodErrorFx" } as const,
								(err) =>
									c.json<NoticeSchema.Type, 500>(
										{
											type: "error",
											message: z.prettifyError((err as { zod: z.ZodError }).zod),
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
