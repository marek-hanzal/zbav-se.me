import { createRoute, z } from "@hono/zod-openapi";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeError } from "~/@common/notice/noticeError";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { withTransactionContextFx } from "~/@common/transaction/context/TransactionContextFx";
import { transactionAcceptFx } from "~/@seller/transaction/fx/transactionAcceptFx";
import { TransactionSchema } from "~/@seller/transaction/schema/TransactionSchema";
import { withDateFx } from "~/database/fx/withDateFx";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";
import { NoticeSchema } from "~/schema/NoticeSchema";

const TransactionAcceptParamsSchema = z
	.object({
		transactionId: z.string().openapi({
			description: "Transaction identifier",
		}),
	})
	.openapi("TransactionAcceptParams", {
		description: "Parameters for accepting a transaction",
	});

export const withAcceptApiFx = Effect.fn("withAcceptApiFx")(function* () {
	const { sellerHono } = yield* RoutesContextFx;
	sellerHono.openapi(
		createRoute({
			method: "post",
			path: "/transaction/{transactionId}/accept",
			description: "Accept a listing transaction. Requires access to the transaction.",
			operationId: "apiTransactionAccept",
			request: {
				params: TransactionAcceptParamsSchema,
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: TransactionSchema,
						},
					},
					description: "Transaction was accepted",
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
					description: "Listing transaction not found or not accessible",
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
			summary: "Accept a listing transaction",
		}),
		async (c) => {
			const axiomConfig = ServerAxiomSchema.parse(process.env);

			return Effect.gen(function* () {
				const user = c.get("user");
				const { transactionId } = c.req.valid("param");

				yield* Effect.annotateLogsScoped({
					endpoint: "apiTransactionAccept",
					userId: user.id,
				});

				return c.json(
					yield* zodGuardFx({
						schema: TransactionSchema,
						dataFx: transactionAcceptFx({
							transactionId,
							userId: user.id,
						}),
					}),
					200,
				);
			}).pipe(
				withLoggingFx(axiomConfig, "apiTransactionAccept", c.get("traceId")),
				withKyselyFx(c.get("kysely")),
				withDateFx,
				withTransactionContextFx(),
				withCatchFx({
					NotFoundErrorFx() {
						return c.json(NotFoundNotice, 404);
					},
					AccessDeniedErrorFx() {
						return c.json(NotFoundNotice, 404);
					},
					InvalidRequestErrorFx(e) {
						return c.json(noticeError(e), 400);
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
