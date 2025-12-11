import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { TransactionQuerySchema } from "~/app/transaction/schema/TransactionQuerySchema";
import { UserContextProvider } from "~/auth/fx/UserContextFx";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { transactionFetchFx } from "./fx/transactionFetchFx";
import { TransactionSchema } from "./schema/TransactionSchema";

export const withFetchApi: Routes.Fn = ({ userHono }) => {
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
				return c.json<TransactionSchema.Type, 200>(
					yield* transactionFetchFx({
						query: c.req.valid("json"),
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
									_tag: "NotFoundError",
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
									_tag: "UnknownException",
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
