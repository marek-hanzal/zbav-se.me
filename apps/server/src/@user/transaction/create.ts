import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { TransactionSchema } from "~/@user/transaction/schema/TransactionSchema";
import { UserContextProvider } from "~/auth/fx/UserContextFx";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import { TransactionContextProvider } from "./fx/TransactionContextFx";
import { transactionCreateFx } from "./fx/transactionCreateFx";
import { TransactionCreateSchema } from "./schema/TransactionCreateSchema";

export const withCreateApi: Routes.Fn = async ({ userHono }) => {
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
			},
			tags: [
				"transaction",
				"user",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json<TransactionSchema.Type, 201>(
					yield* transactionCreateFx(c.req.valid("json")),
					201,
				);
			}).pipe(
				DatabaseContextProvider(c.get("database")),
				TransactionContextProvider(),
				UserContextProvider(c.get("user")),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(Match.value(e).pipe(Match.exhaustive));
				}),
				Effect.runPromise,
			);
		},
	);
};
