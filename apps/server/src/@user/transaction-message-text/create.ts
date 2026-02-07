import { createRoute } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeError } from "~/@common/notice/noticeError";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { withTransactionContextFx } from "~/@common/transaction/context/TransactionContextFx";
import { MessageTextSchema } from "~/@user/message-text/schema/MessageTextSchema";
import { transactionMessageTextCreateFx } from "~/@user/transaction-message-text/fx/transactionMessageTextCreateFx";
import { TransactionMessageTextCreateSchema } from "~/@user/transaction-message-text/schema/TransactionMessageTextCreateSchema";
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
			path: "/transaction-message-text/create",
			description:
				"Create a message text for a transaction. Requires access to the transaction.",
			operationId: "apiTransactionMessageTextCreate",
			request: {
				body: {
					content: {
						"application/json": {
							schema: TransactionMessageTextCreateSchema,
						},
					},
					description: "Query object for transaction message creation",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: MessageTextSchema,
						},
					},
					description: "Message created",
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
				"Transaction Message Text",
			],
			summary: "Create a text message for a transaction",
		}),
		async (c) => {
			const axiomConfig = ServerAxiomSchema.parse(process.env);

			return Effect.gen(function* () {
				const user = c.get("user");

				yield* Effect.annotateLogsScoped({
					endpoint: "apiTransactionMessageTextCreate",
					userId: user.id,
				});

				const result = c.json<MessageTextSchema.Type, 200>(
					yield* zodFx({
						schema: MessageTextSchema,
						dataFx: transactionMessageTextCreateFx({
							...c.req.valid("json"),
							userId: user.id,
						}) satisfies Effect.Effect<MessageTextSchema.Type, any, any>,
					}),
					200,
				);

				yield* Effect.log("apiTransactionMessageTextCreate");

				return result;
			}).pipe(
				withLoggingFx(axiomConfig),
				withKyselyFx(c.get("kysely")),
				withDateFx,
				withTransactionContextFx(),
				withCatchFx({
					InvalidRequestError(e) {
						return c.json(noticeError(e), 400);
					},
					NotFoundErrorFx() {
						return c.json(NotFoundNotice, 404);
					},
					AccessDeniedError() {
						return c.json(NotFoundNotice, 404);
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
