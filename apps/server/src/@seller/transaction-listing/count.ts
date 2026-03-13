import { createRoute } from "@hono/zod-openapi";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { transactionListingCountFx } from "~/@seller/transaction-listing/fx/transactionListingCountFx";
import { TransactionListingCountQuerySchema } from "~/@seller/transaction-listing/schema/TransactionListingCountQuerySchema";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { CountSchema } from "~/schema/CountSchema";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withCountApiFx = Effect.fn("withCountApiFx")(function* () {
	const { sellerHono } = yield* RoutesContextFx;

	sellerHono.openapi(
		createRoute({
			method: "post",
			path: "/transaction-listing/count",
			description: "Returns count of transaction-listing aggregates based on provided query",
			operationId: "apiTransactionListingCount",
			request: {
				body: {
					content: {
						"application/json": {
							schema: TransactionListingCountQuerySchema,
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
					description: "Return counts based on provided query",
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
			summary: "Count transaction-listing aggregates based on the provided query",
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = c.get("user");

				return c.json(
					yield* zodGuardFx({
						schema: CountSchema,
						dataFx: transactionListingCountFx({
							...c.req.valid("json"),
							scope: {
								userId: user.id,
							},
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
});
