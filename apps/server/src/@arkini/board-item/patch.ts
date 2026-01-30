import { createRoute, z } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { boardItemPatchFx } from "~/@arkini/board-item/fx/boardItemPatchFx";
import { BoardItemPatchSchema } from "~/@arkini/board-item/schema/BoardItemPatchSchema";
import { BoardItemSchema } from "~/@arkini/board-item/schema/BoardItemSchema";
import { KyselyContextLayer } from "~/database/context/KyselyContextLayer";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withPatchApiFx = Effect.fn("withPatchApiFx")(function* () {
	const { arkiniHono } = yield* RoutesContextFx;
	arkiniHono.openapi(
		createRoute({
			method: "post",
			path: "/board-item/patch",
			description: "Update an existing board item",
			operationId: "apiBoardItemPatch",
			request: {
				body: {
					content: {
						"application/json": {
							schema: BoardItemPatchSchema,
						},
					},
					description: "Data for updating an existing board item",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: BoardItemSchema,
						},
					},
					description: "The updated board item",
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
			tags: [
				"Board Item",
			],
			summary: "Partial update of a board item",
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = c.get("user");

				return c.json<BoardItemSchema.Type, 200>(
					yield* zodFx({
						schema: BoardItemSchema,
						dataFx: boardItemPatchFx({
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
								{
									_tag: "NotFoundErrorFx",
								},
								() =>
									c.json<NoticeSchema.Type, 404>(
										{
											type: "error",
											message: (
												e as {
													message: string;
												}
											).message,
										},
										404,
									),
							),
							Match.when(
								{
									_tag: "ZodErrorFx",
								} as const,
								(e) =>
									c.json<NoticeSchema.Type, 500>(
										{
											type: "error",
											message: z.prettifyError(
												(
													e as {
														zod: z.ZodError;
													}
												).zod,
											),
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
