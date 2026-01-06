import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { MessagePackageSchema } from "~/@user/message-package/schema/MessagePackageSchema";
import { TransactionContextProvider } from "~/@user/transaction/fx/TransactionContextFx";
import { UserContextProvider } from "~/auth/fx/UserContextFx";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { transactionMessagePackageCreateFx } from "./fx/transactionMessagePackageCreateFx";
import { TransactionMessagePackageCreateSchema } from "./schema/TransactionMessagePackageCreateSchema";

export const withCreateApi: Routes.Fn = async ({ userHono }) => {
	userHono.openapi(
		createRoute({
			method: "post",
			path: "/transaction-message-package/create",
			description:
				"Create a message package for a transaction. Requires access to the transaction.",
			operationId: "apiTransactionMessagePackageCreate",
			request: {
				body: {
					content: {
						"application/json": {
							schema: TransactionMessagePackageCreateSchema,
						},
					},
					description: "Query object for transaction message package creation",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: MessagePackageSchema,
						},
					},
					description: "Message package created",
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
				"transaction-message-package",
				"user",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json<MessagePackageSchema.Type, 200>(
					yield* transactionMessagePackageCreateFx(c.req.valid("json")),
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
