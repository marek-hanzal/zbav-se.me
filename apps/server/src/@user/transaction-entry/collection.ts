import { createRoute, z } from "@hono/zod-openapi";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { transactionEntryCollectionFx } from "~/@user/transaction-entry/fx/transactionEntryCollectionFx";
import { TransactionEntryQuerySchema } from "~/@user/transaction-entry/schema/TransactionEntryQuerySchema";
import { TransactionEntrySchema } from "~/@user/transaction-entry/schema/TransactionEntrySchema";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";
import { NoticeSchema } from "~/schema/NoticeSchema";

const CollectionSchema = z.array(TransactionEntrySchema);

export const withTransactionEntryCollectionApiFx = Effect.fn("withTransactionEntryCollectionApiFx")(
	function* () {
		const { userHono } = yield* RoutesContextFx;

		userHono.openapi(
			createRoute({
				method: "post",
				path: "/transaction-entry/collection",
				description: "Returns transaction entries based on the provided query",
				operationId: "apiTransactionEntryCollection",
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
								schema: CollectionSchema,
							},
						},
						description: "Transaction entry collection",
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
				summary: "Fetch a transaction entry collection",
			}),
			async (c) => {
				const axiomConfig = ServerAxiomSchema.parse(process.env);

				return Effect.gen(function* () {
					const user = c.get("user");

					yield* Effect.annotateLogsScoped({
						endpoint: "apiTransactionEntryCollection",
						userId: user.id,
					});

					return c.json(
						yield* zodGuardFx({
							schema: CollectionSchema,
							dataFx: transactionEntryCollectionFx({
								...c.req.valid("json"),
								userId: user.id,
							}),
						}),
						200,
					);
				}).pipe(
					withLoggingFx(axiomConfig, "apiTransactionEntryCollection", c.get("traceId")),
					withKyselyFx(c.get("kysely")),
					withCatchFx({
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
