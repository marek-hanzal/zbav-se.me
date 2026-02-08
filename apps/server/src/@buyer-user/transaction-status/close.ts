import { createRoute } from "@hono/zod-openapi";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { transactionStatusCloseFx } from "~/@buyer-user/transaction-status/fx/transactionStatusCloseFx";
import { TransactionStatusCloseSchema } from "~/@buyer-user/transaction-status/schema/TransactionStatusCloseSchema";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeError } from "~/@common/notice/noticeError";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { withTransactionContextFx } from "~/@common/transaction/context/TransactionContextFx";
import { TransactionStatusSchema } from "~/@user/transaction-status/schema/TransactionStatusSchema";
import { withDateFx } from "~/database/fx/withDateFx";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withCloseApiFx = Effect.fn("withCloseApiFx")(function* () {
	const { buyerUserHono } = yield* RoutesContextFx;
	buyerUserHono.openapi(
		createRoute({
			method: "post",
			path: "/transaction/status/close",
			description: "Close a listing transaction. Requires access to the transaction.",
			operationId: "apiTransactionStatusClose",
			request: {
				body: {
					content: {
						"application/json": {
							schema: TransactionStatusCloseSchema,
						},
					},
					description: "Query object for listing transaction access validation",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: TransactionStatusSchema,
						},
					},
					description: "Closed status created",
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
				"Transaction Status",
			],
			summary: "Close a listing transaction",
		}),
		async (c) => {
			const axiomConfig = ServerAxiomSchema.parse(process.env);

			return Effect.gen(function* () {
				const user = c.get("user");

				yield* Effect.annotateLogsScoped({
					endpoint: "apiTransactionStatusClose",
					userId: user.id,
				});

				return c.json(
					yield* zodGuardFx({
						schema: TransactionStatusSchema,
						dataFx: transactionStatusCloseFx({
							...c.req.valid("json"),
							userId: user.id,
						}),
					}),
					200,
				);
			}).pipe(
				Effect.tap(() => Effect.log("apiTransactionStatusClose")),
				withLoggingFx(axiomConfig),
				withKyselyFx(c.get("kysely")),
				withDateFx,
				withTransactionContextFx(),
				withCatchFx({
					NotFoundErrorFx() {
						return c.json(NotFoundNotice, 404);
					},
					AccessDeniedError() {
						return c.json(NotFoundNotice, 404);
					},
					InvalidRequestError(e) {
						return c.json(noticeError(e), 400);
					},
					RuntimeError(e) {
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
