import { createRoute } from "@hono/zod-openapi";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeError } from "~/@common/notice/noticeError";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { TransactionQuerySchema } from "~/@common/transaction/schema/TransactionQuerySchema";
import { transactionFetchFx } from "~/@seller/transaction/fx/transactionFetchFx";
import { transactionGetBuyerInfoFx } from "~/@seller/transaction/fx/transactionGetBuyerInfoFx";
import { TransactionBuyerInfoSchema } from "~/@seller/transaction/schema/TransactionBuyerInfoSchema";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withBuyerInfoApiFx = Effect.fn("withBuyerInfoApiFx")(function* () {
	const { sellerHono } = yield* RoutesContextFx;
	sellerHono.openapi(
		createRoute({
			method: "post",
			path: "/transaction/buyer-info",
			description:
				"Return buyer info for a transaction. Requires seller access to the transaction.",
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
			const axiomConfig = ServerAxiomSchema.parse(process.env);

			return Effect.gen(function* () {
				const user = c.get("user");

				yield* Effect.annotateLogsScoped({
					endpoint: "apiTransactionBuyerInfo",
					userId: user.id,
				});

				const transaction = yield* transactionFetchFx({
					...c.req.valid("json"),
					scope: {
						userId: user.id,
					},
				});

				return c.json(
					yield* zodGuardFx({
						schema: TransactionBuyerInfoSchema,
						dataFx: transactionGetBuyerInfoFx({
							userId: user.id,
							transactionId: transaction.id,
						}),
					}),
					200,
				);
			}).pipe(
				withLoggingFx(axiomConfig, "apiTransactionBuyerInfo", c.get("traceId")),
				withKyselyFx(c.get("kysely")),
				withCatchFx({
					NotFoundErrorFx() {
						return c.json(NotFoundNotice, 404);
					},
					RuntimeErrorFx(e) {
						return c.json(noticeError(e), 500);
					},
					ZodErrorFx({ zod }) {
						return c.json(noticeZodError(zod), 500);
					},
				}),
				Effect.runPromise,
			);
		},
	);
});
