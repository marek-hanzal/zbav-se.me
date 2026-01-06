import { createRoute } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { MessageGallerySchema } from "~/app/message-gallery/schema/MessageGallerySchema";
import { TransactionContextProvider } from "~/app/transaction/context/TransactionContextFx";
import { UserContextFx, UserContextProvider } from "~/auth/fx/UserContextFx";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { transactionMessageGalleryCreateFx } from "./fx/transactionMessageGalleryCreateFx";
import { TransactionMessageGalleryCreateSchema } from "./schema/TransactionMessageGalleryCreateSchema";

export const withCreateApi: Routes.Fn = async ({ userHono }) => {
	userHono.openapi(
		createRoute({
			method: "post",
			path: "/transaction-message-gallery/create",
			description:
				"Create a message gallery for a transaction. Requires access to the transaction.",
			operationId: "apiTransactionMessageGalleryCreate",
			request: {
				body: {
					content: {
						"application/json": {
							schema: TransactionMessageGalleryCreateSchema,
						},
					},
					description: "Query object for transaction message gallery creation",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: MessageGallerySchema,
						},
					},
					description: "Message gallery created",
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
				"transaction-message-gallery",
				"user",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = yield* UserContextFx;

				return c.json<MessageGallerySchema.Type, 200>(
					yield* zodFx({
						schema: MessageGallerySchema,
						dataFx: transactionMessageGalleryCreateFx({
							...c.req.valid("json"),
							userId: user.id,
						}),
					}),
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
