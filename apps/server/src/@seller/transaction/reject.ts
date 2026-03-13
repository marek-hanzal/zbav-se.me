import { createRoute, z } from "@hono/zod-openapi";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeError } from "~/@common/notice/noticeError";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { withTransactionContextFx } from "~/@common/transaction/context/withTransactionContextFx";
import { transactionRejectFx } from "~/@seller/transaction/fx/transactionRejectFx";
import { TransactionSchema } from "~/@seller/transaction/schema/TransactionSchema";
import { withDateFx } from "~/database/fx/withDateFx";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";

const TransactionRejectParamsSchema = z
	.object({
		transactionId: z.string().openapi({
			description: "Transaction identifier",
		}),
	})
	.openapi("SellerTransactionRejectParams", {
		description: "Parameters for rejecting a transaction",
	});

export const withRejectApiFx = Effect.fn("withRejectApiFx")(function* () {
	const { sellerHono } = yield* RoutesContextFx;
	sellerHono.openapi(
		createRoute({
			method: "post",
			path: "/transaction/{transactionId}/reject",
			description: "Reject a listing transaction. Requires access to the transaction.",
			operationId: "apiTransactionSellerReject",
			request: {
				params: TransactionRejectParamsSchema,
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: TransactionSchema,
						},
					},
					description: "Transaction was rejected",
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
				"Transaction",
			],
			summary: "Reject a listing transaction",
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = c.get("user");
				const { transactionId } = c.req.valid("param");

				return c.json(
					yield* zodGuardFx({
						schema: TransactionSchema,
						dataFx: transactionRejectFx({
							transactionId,
							userId: user.id,
						}),
					}),
					200,
				);
			}).pipe(
				withKyselyFx(c.get("kysely")),
				withDateFx,
				withTransactionContextFx(),
				withCatchFx({
					NotFoundErrorFx() {
						return c.json(NotFoundNotice, 404);
					},
					AccessDeniedErrorFx() {
						return c.json(NotFoundNotice, 404);
					},
					InvalidRequestErrorFx(e) {
						return c.json(noticeError(e), 400);
					},
					RuntimeErrorFx(e) {
						return c.json(noticeError(e), 500);
					},
					ZodErrorFx({ zod }) {
						return c.json(noticeZodError(zod), 500);
					},
				}),
				Effect.runPromise,
			);
		},
	);
});
