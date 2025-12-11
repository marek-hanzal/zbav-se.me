import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { UserContextProvider } from "~/auth/fx/UserContextFx";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import { MessageSchema } from "~/schema/MessageSchema";
import { withCollectionSchema } from "~/schema/withCollectionSchema";
import { transactionLogCollectionFx } from "./fx/transactionLogCollectionFx";
import { TransactionLogQuerySchema } from "./schema/TransactionLogQuerySchema";
import { TransactionLogSchema } from "./schema/TransactionLogSchema";

export const withTransactionLogCollectionApi: Routes.Fn = ({ userHono }) => {
	userHono.openapi(
		createRoute({
			method: "post",
			path: "/transaction-log/collection",
			description: "Returns listing transaction log entries based on provided parameters",
			operationId: "apiTransactionLogCollection",
			request: {
				body: {
					content: {
						"application/json": {
							schema: TransactionLogQuerySchema,
						},
					},
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: withCollectionSchema({
								schema: TransactionLogSchema,
								type: "TransactionLogCollection",
								description: "Collection of listing transaction log entries",
							}),
						},
					},
					description:
						"Access collection of listing transaction log entries based on provided query",
				},
				500: {
					content: {
						"application/json": {
							schema: MessageSchema,
						},
					},
					description: "Internal server error",
				},
			},
			tags: [
				"transaction-log",
				"user",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json<withCollectionSchema.Type<TransactionLogSchema>, 200>(
					yield* transactionLogCollectionFx({
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
									_tag: "UnknownException",
								},
								() => {
									return c.json<MessageSchema.Type, 500>(
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
