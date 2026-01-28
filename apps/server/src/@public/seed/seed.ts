import { createRoute, z } from "@hono/zod-openapi";
import { createDateContext, DateContextLayer } from "@use-pico/common/date";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { RoutesContextFx } from "~/@common/route/context/RoutesContextFx";
import { TransactionContextProvider } from "~/@common/transaction/context/TransactionContextFx";
import { SeedRequestSchema, seedFx } from "~/@public/seed/fx/seedFx";
import { KyselyContextLayer } from "~/database/context/KyselyContextLayer";
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
				403: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Access denied",
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
					yield* zodFx({
						schema: SeedRequestSchema,
						dataFx: seedFx({
							...c.req.valid("json"),
						}),
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
								(err) => {
									return c.json<NoticeSchema.Type, 400>(
										{
											type: "error",
											message: err.message,
										},
										400,
									);
								},
							),
							Match.when(
								{
									_tag: "AccessDeniedError",
								},
								(err) => {
									return c.json<NoticeSchema.Type, 403>(
										{
											type: "error",
											message: err.message,
										},
										403,
									);
								},
							),
							Match.when(
								{
									_tag: "NotFoundErrorFx",
								},
								(err) => {
									return c.json<NoticeSchema.Type, 404>(
										{
											type: "error",
											message: err.message,
										},
										404,
									);
								},
							),
							Match.when(
								{
									_tag: "ZodErrorFx",
								},
								({ zod }) => {
									return c.json<NoticeSchema.Type, 500>(
										{
											type: "error",
											message: z.prettifyError(zod),
										},
										500,
									);
								},
							),
							Match.when(
								{
									_tag: "RuntimeError",
								},
								(err) => {
									return c.json<NoticeSchema.Type, 500>(
										{
											type: "error",
											message: err.message,
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
