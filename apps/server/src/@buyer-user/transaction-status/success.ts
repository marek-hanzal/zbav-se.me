import { createRoute } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { transactionStatusSuccessFx } from "~/@buyer-user/transaction-status/fx/transactionStatusSuccessFx";
import { TransactionStatusSuccessSchema } from "~/@buyer-user/transaction-status/schema/TransactionStatusSuccessSchema";
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

export const withSuccessApiFx = Effect.fn("withSuccessApiFx")(function* () {
	const { buyerUserHono } = yield* RoutesContextFx;
	buyerUserHono.openapi(
		createRoute({
			method: "post",
			path: "/transaction/status/success",
			description:
				"Mark a listing transaction as successful. Requires access to the transaction.",
			operationId: "apiTransactionStatusSuccess",
			request: {
				body: {
					content: {
						"application/json": {
							schema: TransactionStatusSuccessSchema,
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
					description: "Success status created",
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
			summary: "Mark a listing transaction as successful",
		}),
		async (c) => {
			const axiomConfig = ServerAxiomSchema.parse(process.env);

			return Effect.gen(function* () {
				const user = c.get("user");

				yield* Effect.annotateLogsScoped({
					endpoint: "apiTransactionStatusSuccess",
					userId: user.id,
				});

				const result = c.json<TransactionStatusSchema.Type, 200>(
					yield* zodFx({
						schema: TransactionStatusSchema,
						dataFx: transactionStatusSuccessFx({
							...c.req.valid("json"),
							userId: user.id,
						}) satisfies Effect.Effect<TransactionStatusSchema.Type, any, any>,
					}),
					200,
				);

				yield* Effect.log("apiTransactionStatusSuccess");

				return result;
			}).pipe(
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
