import { createRoute } from "@hono/zod-openapi";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeError } from "~/@common/notice/noticeError";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { withTransactionContextFx } from "~/@common/transaction/context/TransactionContextFx";
import { MessagePersonalSchema } from "~/@user/message-personal/schema/MessagePersonalSchema";
import { transactionMessagePersonalCreateFx } from "~/@user/transaction-message-personal/fx/transactionMessagePersonalCreateFx";
import { TransactionMessagePersonalCreateSchema } from "~/@user/transaction-message-personal/schema/TransactionMessagePersonalCreateSchema";
import { withDateFx } from "~/database/fx/withDateFx";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withCreateApiFx = Effect.fn("withCreateApiFx")(function* () {
	const { userHono } = yield* RoutesContextFx;

	userHono.openapi(
		createRoute({
			method: "post",
			path: "/transaction-message-personal/create",
			description:
				"Create a personal message for a transaction. Requires access to the transaction.",
			operationId: "apiTransactionMessagePersonalCreate",
			request: {
				body: {
					content: {
						"application/json": {
							schema: TransactionMessagePersonalCreateSchema,
						},
					},
					description: "Query object for transaction personal message creation",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: MessagePersonalSchema,
						},
					},
					description: "Personal message created",
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
				"transaction-message-personal",
				"user",
			],
		}),
		async (c) => {
			const axiomConfig = ServerAxiomSchema.parse(process.env);

			return Effect.gen(function* () {
				const user = c.get("user");

				yield* Effect.annotateLogsScoped({
					endpoint: "apiTransactionMessagePersonalCreate",
					userId: user.id,
				});

				return c.json(
					yield* zodGuardFx({
						schema: MessagePersonalSchema,
						dataFx: transactionMessagePersonalCreateFx({
							...c.req.valid("json"),
							userId: user.id,
						}),
					}),
					200,
				);
			}).pipe(
				withLoggingFx(axiomConfig, "apiTransactionMessagePersonalCreate"),
				withKyselyFx(c.get("kysely")),
				withDateFx,
				withTransactionContextFx(),
				withCatchFx({
					NotFoundErrorFx() {
						return c.json(NotFoundNotice, 404);
					},
					RuntimeError(e) {
						return c.json(noticeError(e), 500);
					},
					InvalidRequestError(e) {
						return c.json(noticeError(e), 400);
					},
					AccessDeniedError() {
						return c.json(NotFoundNotice, 404);
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
