import { createRoute, z } from "@hono/zod-openapi";
import { createDateContext, DateContextLayer } from "@use-pico/common/date";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { TransactionContextProvider } from "~/@common/transaction/context/TransactionContextFx";
import { MessageTextSchema } from "~/@user/message-text/schema/MessageTextSchema";
import { transactionMessageTextCreateFx } from "~/@user/transaction-message-text/fx/transactionMessageTextCreateFx";
import { KyselyContextLayer } from "~/database/context/KyselyContextLayer";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { TransactionMessageTextCreateSchema } from "~/@user/transaction-message-text/schema/TransactionMessageTextCreateSchema";

export const withCreateApiFx = Effect.fn("withCreateApiFx")(function* () {
	const { userHono } = yield* RoutesContextFx;
	userHono.openapi(
		createRoute({
			method: "post",
			path: "/transaction-message-text/create",
			description:
				"Create a message text for a transaction. Requires access to the transaction.",
			operationId: "apiTransactionMessageTextCreate",
			request: {
				body: {
					content: {
						"application/json": {
							schema: TransactionMessageTextCreateSchema,
						},
					},
					description: "Query object for transaction message creation",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: MessageTextSchema,
						},
					},
					description: "Message created",
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
				"Transaction Message Text",
			],
			summary: "Create a text message for a transaction",
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = c.get("user");

				return c.json<MessageTextSchema.Type, 200>(
					yield* zodFx({
						schema: MessageTextSchema,
						dataFx: transactionMessageTextCreateFx({
							...c.req.valid("json"),
							userId: user.id,
						}) satisfies Effect.Effect<MessageTextSchema.Type, any, any>,
					}),
					200,
				);
			}).pipe(
				Effect.provide(KyselyContextLayer(c.get("kysely"))),
				Effect.provide(DateContextLayer(createDateContext())),
				TransactionContextProvider(),
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
