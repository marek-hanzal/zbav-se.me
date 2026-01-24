import { createRoute, z } from "@hono/zod-openapi";
import { createDateContext, DateContextLayer } from "@use-pico/common/date";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { TransactionContextProvider } from "~/@user/transaction/context/TransactionContextFx";
import { TransactionStatusSchema } from "~/@user/transaction-status/schema/TransactionStatusSchema";
import { RoutesContextFx } from "~/app/routes/RoutesContextFx";
import { transactionStatusRejectFx } from "~/app/transaction-status/fx/transactionStatusRejectFx";
import { KyselyContextLayer } from "~/database/context/KyselyContextLayer";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { TransactionStatusRejectSchema } from "./schema/TransactionStatusRejectSchema";

export const withRejectApiFx = Effect.fn("withRejectApiFx")(function* () {
	const { userHono } = yield* RoutesContextFx;
	userHono.openapi(
		createRoute({
			method: "post",
			path: "/transaction/status/reject",
			description: "Reject a listing transaction. Requires access to the transaction.",
			operationId: "apiTransactionStatusReject",
			request: {
				body: {
					content: {
						"application/json": {
							schema: TransactionStatusRejectSchema,
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
					description: "Rejected status created",
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
			summary: "Reject a listing transaction",
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = c.get("user");

				return c.json<TransactionStatusSchema.Type, 200>(
					yield* zodFx({
						schema: TransactionStatusSchema,
						dataFx: transactionStatusRejectFx({
							...c.req.valid("json"),
							userId: user.id,
						}) satisfies Effect.Effect<TransactionStatusSchema.Type, any, any>,
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
