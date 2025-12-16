import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { TransactionSchema } from "~/@user/transaction/schema/TransactionSchema";
import { UserContextProvider } from "~/auth/fx/UserContextFx";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { TransactionContextProvider } from "./fx/TransactionContextFx";
import { transactionCreateFx } from "./fx/transactionCreateFx";
import { TransactionCreateSchema } from "./schema/TransactionCreateSchema";

export const withCreateApi: Routes.Fn = ({ userHono }) => {
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
				403: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Access denied",
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
