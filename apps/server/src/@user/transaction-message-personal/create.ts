import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { MessagePersonalSchema } from "~/@user/message-personal/schema/MessagePersonalSchema";
import { TransactionContextProvider } from "~/@user/transaction/fx/TransactionContextFx";
import { UserContextProvider } from "~/auth/fx/UserContextFx";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { transactionMessagePersonalCreateFx } from "./fx/transactionMessagePersonalCreateFx";
import { TransactionMessagePersonalCreateSchema } from "./schema/TransactionMessagePersonalCreateSchema";

export const withCreateApi: Routes.Fn = async ({ userHono }) => {
	userHono.openapi(
		createRoute({
			method: "post",
			path: "/transaction-message-personal/create",
			description:
				"Create a personal message for a transaction. Requires access to the transaction.",
			operationId: "apiTransactionMessagePersonalCreate",
			request: {
				body: {
					content: {
						"application/json": {
							schema: TransactionMessagePersonalCreateSchema,
						},
					},
					description: "Query object for transaction personal message creation",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: MessagePersonalSchema,
						},
					},
					description: "Personal message created",
				},
				400: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Invalid request",
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
					description: "Transaction not found or not accessible",
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
				"transaction-message-personal",
				"user",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json<MessagePersonalSchema.Type, 200>(
					yield* transactionMessagePersonalCreateFx(c.req.valid("json")),
					200,
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
									_tag: "RuntimeError",
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
							Match.when(
								{
									_tag: "InvalidRequestError",
								},
								() => {
									return c.json<NoticeSchema.Type, 400>(
										{
											type: "error",
											message: e.message,
										},
										400,
									);
								},
							),
							Match.when(
								{
									_tag: "AccessDeniedError",
								},
								() => {
									return c.json<NoticeSchema.Type, 403>(
										{
											type: "error",
											message: e.message,
										},
										403,
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
