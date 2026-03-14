import { createRoute } from "@hono/zod-openapi";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { transactionEntryCountFx } from "~/@user/transaction-entry/fx/transactionEntryCountFx";
import { TransactionEntryCountQuerySchema } from "~/@user/transaction-entry/schema/TransactionEntryCountQuerySchema";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { CountSchema } from "~/schema/CountSchema";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withTransactionEntryCountApiFx = Effect.fn("withTransactionEntryCountApiFx")(
	function* () {
		const { userHono } = yield* RoutesContextFx;

		userHono.openapi(
			createRoute({
				method: "post",
				path: "/transaction-entry/count",
				description: "Returns count of transaction entries for the provided query",
				operationId: "apiTransactionEntryCount",
				request: {
					body: {
						content: {
							"application/json": {
								schema: TransactionEntryCountQuerySchema,
							},
						},
					},
				},
				responses: {
					200: {
						content: {
							"application/json": {
								schema: CountSchema,
							},
						},
						description: "Transaction entry count",
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
				summary: "Count transaction entries",
			}),
			async (c) => {
				return Effect.gen(function* () {
					const user = c.get("user");

					return c.json(
						yield* zodGuardFx({
							schema: CountSchema,
							dataFx: transactionEntryCountFx({
								...c.req.valid("json"),
								userId: user.id,
							}),
						}),
						200,
					);
				}).pipe(
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
