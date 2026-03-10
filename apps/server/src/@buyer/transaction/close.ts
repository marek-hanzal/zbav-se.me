import { createRoute, z } from "@hono/zod-openapi";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { transactionCloseFx } from "~/@buyer/transaction/fx/transactionCloseFx";
import { TransactionSchema } from "~/@buyer/transaction/schema/TransactionSchema";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeError } from "~/@common/notice/noticeError";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { withTransactionContextFx } from "~/@common/transaction/context/TransactionContextFx";
import { withDateFx } from "~/database/fx/withDateFx";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";
import { NoticeSchema } from "~/schema/NoticeSchema";

const TransactionCloseParamsSchema = z
	.object({
		transactionId: z.string().openapi({
			description: "Transaction identifier",
		}),
	})
	.openapi("TransactionCloseParams", {
		description: "Parameters for closing a transaction",
	});

export const withCloseApiFx = Effect.fn("withCloseApiFx")(function* () {
	const { buyerHono } = yield* RoutesContextFx;
	buyerHono.openapi(
		createRoute({
			method: "post",
			path: "/transaction/{transactionId}/close",
			description: "Close a listing transaction. Requires access to the transaction.",
			operationId: "apiTransactionClose",
			request: {
				params: TransactionCloseParamsSchema,
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: TransactionSchema,
						},
					},
					description: "Transaction was closed",
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
			summary: "Close a listing transaction",
		}),
		async (c) => {
			const axiomConfig = ServerAxiomSchema.parse(process.env);

			return Effect.gen(function* () {
				const user = c.get("user");
				const { transactionId } = c.req.valid("param");

				yield* Effect.annotateLogsScoped({
					endpoint: "apiTransactionClose",
					userId: user.id,
				});

				return c.json(
					yield* zodGuardFx({
						schema: TransactionSchema,
						dataFx: transactionCloseFx({
							transactionId,
							userId: user.id,
						}),
					}),
					200,
				);
			}).pipe(
				withLoggingFx(axiomConfig, "apiTransactionClose", c.get("traceId")),
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
