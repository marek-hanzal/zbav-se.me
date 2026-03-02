import { createRoute } from "@hono/zod-openapi";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { transactionListingFetchFx } from "~/@seller/transaction-listing/fx/transactionListingFetchFx";
import { TransactionListingQuerySchema } from "~/@seller/transaction-listing/schema/TransactionListingQuerySchema";
import { TransactionListingSchema } from "~/@seller/transaction-listing/schema/TransactionListingSchema";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withFetchApiFx = Effect.fn("withFetchApiFx")(function* () {
	const { sellerHono } = yield* RoutesContextFx;

	sellerHono.openapi(
		createRoute({
			method: "post",
			path: "/transaction-listing/fetch",
			description: "Return a transaction-listing aggregate based on the provided query",
			operationId: "apiTransactionListingFetch",
			request: {
				body: {
					content: {
						"application/json": {
							schema: TransactionListingQuerySchema,
						},
					},
					description: "Query object for transaction-listing fetch",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: TransactionListingSchema,
						},
					},
					description: "Transaction-listing aggregate matching provided query",
				},
				404: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Transaction-listing aggregate not found",
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
				"Transaction Listing",
			],
			summary: "Fetch a transaction-listing aggregate based on the provided query",
		}),
		async (c) => {
			const axiomConfig = ServerAxiomSchema.parse(process.env);

			return Effect.gen(function* () {
				const user = c.get("user");

				yield* Effect.annotateLogsScoped({
					endpoint: "apiTransactionListingFetch",
					userId: user.id,
				});

				return c.json(
					yield* zodGuardFx({
						schema: TransactionListingSchema,
						dataFx: transactionListingFetchFx({
							...c.req.valid("json"),
							scope: {
								userId: user.id,
							},
						}),
					}),
					200,
				);
			}).pipe(
				withLoggingFx(axiomConfig, "apiTransactionListingFetch"),
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
});
