import { createRoute } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { TransactionSchema } from "~/@user/transaction/schema/TransactionSchema";
import { RoutesContextFx } from "~/app/routes/RoutesContextFx";
import { TransactionContextProvider } from "~/app/transaction/context/TransactionContextFx";
import { transactionCreateFx } from "~/app/transaction/fx/transactionCreateFx";
import { KyselyContextProvider } from "~/database/context/KyselyContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { TransactionCreateSchema } from "./schema/TransactionCreateSchema";

export const withCreateApiFx = Effect.fn("withCreateApiFx")(function* () {
	const { userHono } = yield* RoutesContextFx;
	userHono.openapi(
		createRoute({
			method: "post",
			path: "/transaction/create",
			description: "Create a new transaction",
			operationId: "apiTransactionCreate",
			request: {
				body: {
					content: {
						"application/json": {
							schema: TransactionCreateSchema,
						},
					},
					description: "Data for creating a new transaction",
				},
			},
			responses: {
				201: {
					content: {
						"application/json": {
							schema: TransactionSchema,
						},
					},
					description: "The transaction was created",
				},
				404: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Listing not found",
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

				return c.json<TransactionSchema.Type, 201>(
					yield* zodFx({
						schema: TransactionSchema,
						dataFx: transactionCreateFx({
							...c.req.valid("json"),
							userId: user.id,
						}),
					}),
					201,
				);
			}).pipe(
				KyselyContextProvider(c.get("kysely")),
				TransactionContextProvider(),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{
									_tag: "NotFoundErrorFx",
								},
								() => {
									return c.json<NoticeSchema.Type, 404>(
										{
											type: "error",
											message: e.message,
										},
										404,
									);
								},
							),
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
