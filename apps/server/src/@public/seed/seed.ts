import { createRoute } from "@hono/zod-openapi";
import { createDateContext, DateContextLayer } from "@use-pico/common/date";
import { Effect, Match } from "effect";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeError } from "~/@common/notice/noticeError";
import { TransactionContextProvider } from "~/@common/transaction/context/TransactionContextFx";
import { SeedRequestSchema, seedFx } from "~/@public/seed/fx/seedFx";
import { KyselyContextLayer } from "~/database/context/KyselyContextLayer";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withSeedApiFx = Effect.fn("withSeedApiFx")(function* () {
	const { publicHono } = yield* RoutesContextFx;

	publicHono.openapi(
		createRoute({
			method: "post",
			path: "/seed",
			description: "Seed endpoint for user data",
			operationId: "apiSeed",
			request: {
				body: {
					content: {
						"application/json": {
							schema: SeedRequestSchema,
						},
					},
					description: "User data for seeding",
				},
			},
			responses: {
				201: {
					description: "Seed operation completed",
				},
				400: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Invalid request",
				},
				404: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "User not found",
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
			security: [],
			tags: [
				"Misc",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json(
					yield* seedFx({
						...c.req.valid("json"),
					}),
					201,
				);
			}).pipe(
				Effect.provide(KyselyContextLayer(c.get("kysely"))),
				Effect.provide(DateContextLayer(createDateContext())),
				TransactionContextProvider({
					expires: 7,
					extend: 3,
				}),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{
									_tag: "InvalidRequestError",
								},
								(err) => c.json(noticeError(err), 400),
							),
							Match.when(
								{
									_tag: "AccessDeniedError",
								},
								() => c.json(NotFoundNotice, 404),
							),
							Match.when(
								{
									_tag: "NotFoundErrorFx",
								},
								() => c.json(NotFoundNotice, 404),
							),
							Match.when(
								{
									_tag: "RuntimeError",
								},
								(err) => c.json(noticeError(err), 500),
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
