import { createRoute } from "@hono/zod-openapi";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { transactionListingCollectionFx } from "~/@seller-user/transaction-listing/fx/transactionListingCollectionFx";
import { TransactionListingItemSchema } from "~/@seller-user/transaction-listing/schema/TransactionListingItemSchema";
import { TransactionListingQuerySchema } from "~/@seller-user/transaction-listing/schema/TransactionListingQuerySchema";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { withCollectionSchema } from "~/schema/withCollectionSchema";

const CollectionSchema = withCollectionSchema({
	schema: TransactionListingItemSchema,
	type: "TransactionListingItemSchema",
	description: "Collection of listings that have transactions",
});

export const withCollectionApiFx = Effect.fn("withTransactionListingCollectionApiFx")(function* () {
	const { sellerUserHono } = yield* RoutesContextFx;

	sellerUserHono.openapi(
		createRoute({
			method: "post",
			path: "/transaction-listing/collection",
			description: "Returns listings that have at least one transaction",
			operationId: "apiTransactionListingCollection",
			request: {
				body: {
					content: {
						"application/json": {
							schema: TransactionListingQuerySchema,
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
					description:
						"Access collection of listings that have transactions based on provided query",
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
			summary:
				"Fetch a collection of listings that have transactions based on the provided query",
		}),
		async (c) => {
			const axiomConfig = ServerAxiomSchema.parse(process.env);

			return Effect.gen(function* () {
				const user = c.get("user");

				yield* Effect.annotateLogsScoped({
					endpoint: "apiTransactionListingCollection",
					userId: user.id,
				});

				return c.json(
					yield* zodGuardFx({
						schema: CollectionSchema,
						dataFx: transactionListingCollectionFx({
							...c.req.valid("json"),
							scope: {
								userId: user.id,
							},
						}),
					}),
					200,
				);
			}).pipe(
				Effect.tap(() => Effect.log("apiTransactionListingCollection")),
				withLoggingFx(axiomConfig),
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
