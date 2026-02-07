import { createRoute } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { transactionFetchFx } from "~/@buyer-user/transaction/fx/transactionFetchFx";
import { TransactionSchema } from "~/@buyer-user/transaction/schema/TransactionSchema";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { TransactionQuerySchema } from "~/@common/transaction/schema/TransactionQuerySchema";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withFetchApiFx = Effect.fn("withFetchApiFx")(function* () {
	const { buyerUserHono } = yield* RoutesContextFx;
	buyerUserHono.openapi(
		createRoute({
			method: "post",
			path: "/transaction/fetch",
			description: "Return a transaction based on the provided query",
			operationId: "apiTransactionFetch",
			request: {
				body: {
					content: {
						"application/json": {
							schema: TransactionQuerySchema,
						},
					},
					description: "Query object for transaction fetch",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: TransactionSchema,
						},
					},
					description: "Transaction matching provided query",
				},
				404: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Transaction not found",
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
			summary: "Fetch a transaction based on the provided query",
		}),
		async (c) => {
			const axiomConfig = ServerAxiomSchema.parse(process.env);

			return Effect.gen(function* () {
				const user = c.get("user");

				yield* Effect.annotateLogsScoped({
					endpoint: "apiTransactionFetch",
					userId: user.id,
				});

				const result = c.json<TransactionSchema.Type, 200>(
					yield* zodFx({
						schema: TransactionSchema,
						dataFx: transactionFetchFx({
							...c.req.valid("json"),
							scope: {
								userId: user.id,
							},
						}) satisfies Effect.Effect<TransactionSchema.Type, any, any>,
					}),
					200,
				);

				yield* Effect.log("apiTransactionFetch");

				return result;
			}).pipe(
				withKyselyFx(c.get("kysely")),
				withLoggingFx(axiomConfig),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{
									_tag: "NotFoundErrorFx",
								},
								() => {
									return c.json(NotFoundNotice, 404);
								},
							),
							Match.when(
								{
									_tag: "ZodErrorFx",
								},
								({ zod }) => {
									return c.json(noticeZodError(zod), 500);
								},
							),
							Match.exhaustive,
						),
					);
				}),
				Effect.runPromise,
			);
		},
	);
});
