import { createRoute } from "@hono/zod-openapi";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeError } from "~/@common/notice/noticeError";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { withTransactionContextFx } from "~/@common/transaction/context/TransactionContextFx";
import { transactionEntryCreateFx } from "~/@user/transaction-entry/fx/transactionEntryCreateFx";
import { TransactionEntryCreateSchema } from "~/@user/transaction-entry/schema/TransactionEntryCreateSchema";
import { TransactionEntrySchema } from "~/@user/transaction-entry/schema/TransactionEntrySchema";
import { withDateFx } from "~/database/fx/withDateFx";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withTransactionEntryCreateApiFx = Effect.fn("withTransactionEntryCreateApiFx")(
	function* () {
		const { userHono } = yield* RoutesContextFx;

		userHono.openapi(
			createRoute({
				method: "post",
				path: "/transaction-entry/create",
				description: "Appends one user-authored transaction entry",
				operationId: "apiTransactionEntryCreate",
				request: {
					body: {
						content: {
							"application/json": {
								schema: TransactionEntryCreateSchema,
							},
						},
					},
				},
				responses: {
					201: {
						content: {
							"application/json": {
								schema: TransactionEntrySchema,
							},
						},
						description: "Created transaction entry",
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
						description: "Transaction not found or inaccessible",
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
					"Transaction Entry",
				],
				summary: "Create one transaction entry",
			}),
			async (c) => {
				const axiomConfig = ServerAxiomSchema.parse(process.env);

				return Effect.gen(function* () {
					const user = c.get("user");

					yield* Effect.annotateLogsScoped({
						endpoint: "apiTransactionEntryCreate",
						userId: user.id,
					});

					return c.json(
						yield* zodGuardFx({
							schema: TransactionEntrySchema,
							dataFx: transactionEntryCreateFx({
								...c.req.valid("json"),
								userId: user.id,
							}),
						}),
						201,
					);
				}).pipe(
					withLoggingFx(axiomConfig, "apiTransactionEntryCreate", c.get("traceId")),
					withKyselyFx(c.get("kysely")),
					withDateFx,
					withTransactionContextFx(),
					withCatchFx({
						InvalidRequestErrorFx(e) {
							return c.json(noticeError(e), 400);
						},
						NotFoundErrorFx() {
							return c.json(NotFoundNotice, 404);
						},
						AccessDeniedErrorFx() {
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
	},
);
