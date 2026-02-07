import { createRoute } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeError } from "~/@common/notice/noticeError";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { withTransactionContextFx } from "~/@common/transaction/context/TransactionContextFx";
import { MessageGallerySchema } from "~/@user/message-gallery/schema/MessageGallerySchema";
import { transactionMessageGalleryCreateFx } from "~/@user/transaction-message-gallery/fx/transactionMessageGalleryCreateFx";
import { TransactionMessageGalleryCreateSchema } from "~/@user/transaction-message-gallery/schema/TransactionMessageGalleryCreateSchema";
import { withDateFx } from "~/database/fx/withDateFx";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";

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
				withKyselyFx(c.get("kysely")),
				withDateFx,
				withTransactionContextFx(),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{
									_tag: "InvalidRequestError",
								},
								() => c.json(noticeError(e), 400),
							),
							Match.when(
								{
									_tag: "NotFoundErrorFx",
								},
								() => c.json(NotFoundNotice, 404),
							),
							Match.when(
								{
									_tag: "AccessDeniedError",
								},
								() => c.json(NotFoundNotice, 404),
							),
							Match.when(
								{
									_tag: "RuntimeError",
								},
								() => c.json(noticeError(e), 500),
							),
							Match.when(
								{
									_tag: "ZodErrorFx",
								},
								({ zod }) => c.json(noticeZodError(zod), 500),
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
