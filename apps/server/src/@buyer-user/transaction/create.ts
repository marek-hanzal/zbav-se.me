import { createRoute } from "@hono/zod-openapi";
import { createDateContext, DateContextLayer } from "@use-pico/common/date";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { transactionCreateFx } from "~/@buyer-user/transaction/fx/transactionCreateFx";
import { TransactionCreateSchema } from "~/@buyer-user/transaction/schema/TransactionCreateSchema";
import { TransactionSchema } from "~/@buyer-user/transaction/schema/TransactionSchema";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { TransactionContextProvider } from "~/@common/transaction/context/TransactionContextFx";
import { KyselyContextLayer } from "~/database/context/KyselyContextLayer";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withCreateApiFx = Effect.fn("withCreateApiFx")(function* () {
	const { buyerUserHono } = yield* RoutesContextFx;
	buyerUserHono.openapi(
		createRoute({
			method: "post",
			path: "/transaction/create",
			description: "Create a new transaction",
			operationId: "apiTransactionCreate",
			request: {
				body: {
					content: {
						"application/json": {
							schema: TransactionCreateSchema,
						},
					},
					description: "Data for creating a new transaction",
				},
			},
			responses: {
				201: {
					content: {
						"application/json": {
							schema: TransactionSchema,
						},
					},
					description: "The transaction was created",
				},
				404: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Listing not found",
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
				"Transaction",
			],
			summary: "Create a new transaction",
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = c.get("user");

				return c.json<TransactionSchema.Type, 201>(
					yield* zodFx({
						schema: TransactionSchema,
						dataFx: transactionCreateFx({
							...c.req.valid("json"),
							userId: user.id,
						}) satisfies Effect.Effect<TransactionSchema.Type, any, any>,
					}),
					201,
				);
			}).pipe(
				Effect.provide(KyselyContextLayer(c.get("kysely"))),
				Effect.provide(DateContextLayer(createDateContext())),
				TransactionContextProvider(),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{
									_tag: "NotFoundErrorFx",
								},
								() => c.json(NotFoundNotice, 404),
							),
							Match.when(
								{
									_tag: "ZodErrorFx",
								},
								({ zod }) => c.json(noticeZodError(zod), 500),
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
