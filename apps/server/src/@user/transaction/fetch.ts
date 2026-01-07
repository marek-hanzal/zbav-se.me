import { createRoute } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { transactionFetchFx } from "~/app/transaction/fx/transactionFetchFx";
import { TransactionQuerySchema } from "~/app/transaction/schema/TransactionQuerySchema";
import { UserContextFx, UserContextProvider } from "~/auth/fx/UserContextFx";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { TransactionSchema } from "./schema/TransactionSchema";

export const withFetchApi: Routes.Fn = async ({ userHono }) => {
	userHono.openapi(
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
				"transaction",
				"user",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = yield* UserContextFx;

				return c.json<TransactionSchema.Type, 200>(
					yield* zodFx({
						schema: TransactionSchema,
						dataFx: transactionFetchFx({
							...c.req.valid("json"),
							scope: {
								userId: user.id,
							},
						}),
					}),
					200,
				);
			}).pipe(
				DatabaseContextProvider(c.get("database")),
				UserContextProvider(c.get("user")),
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
};
