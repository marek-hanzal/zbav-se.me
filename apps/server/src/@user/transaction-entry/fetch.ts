import { createRoute } from "@hono/zod-openapi";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { transactionEntryFetchFx } from "~/@user/transaction-entry/fx/transactionEntryFetchFx";
import { TransactionEntryQuerySchema } from "~/@user/transaction-entry/schema/TransactionEntryQuerySchema";
import { TransactionEntrySchema } from "~/@user/transaction-entry/schema/TransactionEntrySchema";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withTransactionEntryFetchApiFx = Effect.fn("withTransactionEntryFetchApiFx")(
	function* () {
		const { userHono } = yield* RoutesContextFx;

		userHono.openapi(
			createRoute({
				method: "post",
				path: "/transaction-entry/fetch",
				description: "Returns one transaction entry based on the provided query",
				operationId: "apiTransactionEntryFetch",
				request: {
					body: {
						content: {
							"application/json": {
								schema: TransactionEntryQuerySchema,
							},
						},
					},
				},
				responses: {
					200: {
						content: {
							"application/json": {
								schema: TransactionEntrySchema,
							},
						},
						description: "Transaction entry",
					},
					404: {
						content: {
							"application/json": {
								schema: NoticeSchema,
							},
						},
						description: "Transaction entry not found",
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
				summary: "Fetch one transaction entry",
			}),
			async (c) => {
				const axiomConfig = ServerAxiomSchema.parse(process.env);

				return Effect.gen(function* () {
					const user = c.get("user");

					yield* Effect.annotateLogsScoped({
						endpoint: "apiTransactionEntryFetch",
						userId: user.id,
					});

					return c.json(
						yield* zodGuardFx({
							schema: TransactionEntrySchema,
							dataFx: transactionEntryFetchFx({
								...c.req.valid("json"),
								userId: user.id,
							}),
						}),
						200,
					);
				}).pipe(
					withLoggingFx(axiomConfig, "apiTransactionEntryFetch", c.get("traceId")),
					withKyselyFx(c.get("kysely")),
					withCatchFx({
						NotFoundErrorFx() {
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
	},
);
