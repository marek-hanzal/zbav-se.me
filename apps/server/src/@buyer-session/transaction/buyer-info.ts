import { createRoute, z } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { transactionGetBuyerInfoFx } from "~/@buyer-session/transaction/fx/transactionGetBuyerInfoFx";
import { transactionFetchFx } from "~/@buyer-user/transaction/fx/transactionFetchFx";
import { TransactionQuerySchema } from "~/@buyer-user/transaction/schema/TransactionQuerySchema";
import { KyselyContextLayer } from "~/database/context/KyselyContextLayer";
import { RoutesContextFx } from "~/routes/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { TransactionBuyerInfoSchema } from "./schema/TransactionBuyerInfoSchema";

export const withBuyerInfoApiFx = Effect.fn("withBuyerInfoApiFx")(function* () {
	const { buyerSessionHono } = yield* RoutesContextFx;

	buyerSessionHono.openapi(
		createRoute({
			method: "post",
			path: "/transaction/buyer-info",
			description: "Return buyer info for a transaction. Requires access to the transaction.",
			operationId: "apiTransactionBuyerInfo",
			request: {
				body: {
					content: {
						"application/json": {
							schema: TransactionQuerySchema,
						},
					},
					description: "Query object for transaction access validation",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: TransactionBuyerInfoSchema,
						},
					},
					description: "Buyer info",
				},
				404: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Transaction not found or not accessible",
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
			summary: "Get buyer info for a transaction",
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = c.get("user");

				const transaction = yield* transactionFetchFx({
					...c.req.valid("json"),
					scope: {
						userId: user.id,
					},
				});

				return c.json<TransactionBuyerInfoSchema.Type, 200>(
					yield* zodFx({
						schema: TransactionBuyerInfoSchema,
						dataFx: transactionGetBuyerInfoFx({
							userId: user.id,
							transactionId: transaction.id,
						}) satisfies Effect.Effect<TransactionBuyerInfoSchema.Type, any, any>,
					}),
					200,
				);
			}).pipe(
				Effect.provide(KyselyContextLayer(c.get("kysely"))),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{
									_tag: "NotFoundErrorFx",
								},
								() => {
									return c.json<NoticeSchema.Type, 404>(
										{
											type: "error",
											message: e.message,
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
							Match.exhaustive,
						),
					);
				}),
				Effect.runPromise,
			);
		},
	);
});
