import { createRoute } from "@hono/zod-openapi";
import { EntitySchema, zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { RoutesContextFx } from "~/app/routes/RoutesContextFx";
import { transactionCollectionFx } from "~/app/transaction/fx/transactionCollectionFx";
import { TransactionQuerySchema } from "~/app/transaction/schema/TransactionQuerySchema";
import { KyselyContextProvider } from "~/database/context/KyselyContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { withCollectionSchema } from "~/schema/withCollectionSchema";

const CollectionSchema = withCollectionSchema({
	schema: EntitySchema,
	type: "TransactionCollection",
	description: "Collection of transactions",
});

export const withCollectionApiFx = Effect.fn("withCollectionApiFx")(function* () {
	const { userHono } = yield* RoutesContextFx;

	userHono.openapi(
		createRoute({
			method: "post",
			path: "/transaction/collection",
			description: "Returns transactions based on provided parameters",
			operationId: "apiTransactionCollection",
			request: {
				body: {
					content: {
						"application/json": {
							schema: TransactionQuerySchema,
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
					description: "Access collection of transactions based on provided query",
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
				"transaction",
				"user",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = c.get("user");

				return c.json<withCollectionSchema.Type<EntitySchema>, 200>(
					yield* zodFx({
						schema: CollectionSchema,
						dataFx: transactionCollectionFx({
							...c.req.valid("json"),
							scope: {
								userId: user.id,
							},
						}),
					}),
					200,
				);
			}).pipe(
				KyselyContextProvider(c.get("kysely")),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{
									_tag: "ZodErrorFx",
								},
								() => {
									return c.json<NoticeSchema.Type, 500>(
										{
											type: "error",
											message: e.message,
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
