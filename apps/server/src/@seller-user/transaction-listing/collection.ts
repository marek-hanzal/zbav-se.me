import { createRoute, z } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { transactionListingCollectionFx } from "~/@seller-user/transaction-listing/fx/transactionListingCollectionFx";
import { TransactionListingQuerySchema } from "~/@seller-user/transaction-listing/schema/TransactionListingQuerySchema";
import { KyselyContextLayer } from "~/database/context/KyselyContextLayer";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { withCollectionSchema } from "~/schema/withCollectionSchema";
import { TransactionListingItemSchema } from "./schema/TransactionListingItemSchema";

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
			return Effect.gen(function* () {
				const user = c.get("user");

				return c.json<withCollectionSchema.Type<TransactionListingItemSchema>, 200>(
					yield* zodFx({
						schema: CollectionSchema,
						dataFx: transactionListingCollectionFx({
							...c.req.valid("json"),
							scope: {
								userId: user.id,
							},
						}) satisfies Effect.Effect<
							withCollectionSchema.Type<TransactionListingItemSchema>,
							any,
							any
						>,
					}),
					200,
				);
			}).pipe(
				Effect.provide(KyselyContextLayer(c.get("kysely"))),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{
									_tag: "ZodErrorFx",
								},
								({ zod }) => {
									return c.json<NoticeSchema.Type, 500>(
										{
											type: "error",
											message: z.prettifyError(zod),
										},
										500,
									);
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
