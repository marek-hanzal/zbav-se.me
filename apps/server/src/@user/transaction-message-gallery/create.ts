import { createRoute, z } from "@hono/zod-openapi";
import { createDateContext, DateContextLayer } from "@use-pico/common/date";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { MessageGallerySchema } from "~/@user/message-gallery/schema/MessageGallerySchema";
import { RoutesContextFx } from "~/app/routes/RoutesContextFx";
import { TransactionContextProvider } from "~/app/transaction/context/TransactionContextFx";
import { transactionMessageGalleryCreateFx } from "~/app/transaction-message-gallery/fx/transactionMessageGalleryCreateFx";
import { KyselyContextLayer } from "~/database/context/KyselyContextLayer";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { TransactionMessageGalleryCreateSchema } from "./schema/TransactionMessageGalleryCreateSchema";

export const withCreateApiFx = Effect.fn("withCreateApiFx")(function* () {
	const { userHono } = yield* RoutesContextFx;

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
				"Transaction Message Gallery",
			],
			summary: "Create a gallery message for a transaction",
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = c.get("user");

				return c.json<MessageGallerySchema.Type, 200>(
					yield* zodFx({
						schema: MessageGallerySchema,
						dataFx: transactionMessageGalleryCreateFx({
							...c.req.valid("json"),
							userId: user.id,
						}) satisfies Effect.Effect<MessageGallerySchema.Type, any, any>,
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
