import { createRoute } from "@hono/zod-openapi";
import { createDateContext, DateContextLayer } from "@use-pico/common/date";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeError } from "~/@common/notice/noticeError";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { TransactionContextProvider } from "~/@common/transaction/context/TransactionContextFx";
import { transactionStatusResolveFx } from "~/@seller-user/transaction-status/fx/transactionStatusResolveFx";
import { TransactionStatusResolveSchema } from "~/@seller-user/transaction-status/schema/TransactionStatusResolveSchema";
import { TransactionStatusSchema } from "~/@seller-user/transaction-status/schema/TransactionStatusSchema";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withResolveApiFx = Effect.fn("withResolveApiFx")(function* () {
	const { sellerUserHono } = yield* RoutesContextFx;
	sellerUserHono.openapi(
		createRoute({
			method: "post",
			path: "/transaction/status/resolve",
			description: "Resolve a listing transaction. Requires access to the transaction.",
			operationId: "apiTransactionStatusResolve",
			request: {
				body: {
					content: {
						"application/json": {
							schema: TransactionStatusResolveSchema,
						},
					},
					description: "Query object for listing transaction access validation",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: TransactionStatusSchema,
						},
					},
					description: "Resolved status created",
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
					description: "Listing transaction not found or not accessible",
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
				"Transaction Status",
			],
			summary: "Resolve a listing transaction",
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = c.get("user");

				return c.json<TransactionStatusSchema.Type, 200>(
					yield* zodFx({
						schema: TransactionStatusSchema,
						dataFx: transactionStatusResolveFx({
							...c.req.valid("json"),
							userId: user.id,
						}) satisfies Effect.Effect<TransactionStatusSchema.Type, any, any>,
					}),
					200,
				);
			}).pipe(
				withKyselyFx(c.get("kysely")),
				Effect.provide(DateContextLayer(createDateContext())),
				TransactionContextProvider(),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{
									_tag: "NotFoundErrorFx",
								},
								() => c.json(NotFoundNotice, 404),
							),
							Match.when(
								{
									_tag: "InvalidRequestError",
								},
								() => c.json(noticeError(e), 400),
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
