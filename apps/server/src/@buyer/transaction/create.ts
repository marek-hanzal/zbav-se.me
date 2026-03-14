import { createRoute } from "@hono/zod-openapi";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { transactionCreateFx } from "~/@buyer/transaction/fx/transactionCreateFx";
import { TransactionCreateSchema } from "~/@buyer/transaction/schema/TransactionCreateSchema";
import { TransactionSchema } from "~/@buyer/transaction/schema/TransactionSchema";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeError } from "~/@common/notice/noticeError";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { withTransactionContextFx } from "~/@common/transaction/context/withTransactionContextFx";
import { withDateFx } from "~/database/fx/withDateFx";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withCreateApiFx = Effect.fn("withCreateApiFx")(function* () {
	const { buyerHono } = yield* RoutesContextFx;
	buyerHono.openapi(
		createRoute({
			method: "post",
			path: "/transaction/create",
			description: "Create a new transaction",
			operationId: "apiTransactionCreate",
			request: {
				body: {
					content: {
						"application/json": {
							schema: TransactionCreateSchema,
						},
					},
					description: "Data for creating a new transaction",
				},
			},
			responses: {
				201: {
					content: {
						"application/json": {
							schema: TransactionSchema,
						},
					},
					description: "The transaction was created",
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
					description: "Listing not found",
				},
				409: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Conflict (e.g. duplicate transaction)",
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
			summary: "Create a new transaction",
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = c.get("user");

				return c.json(
					yield* zodGuardFx({
						schema: TransactionSchema,
						dataFx: transactionCreateFx({
							...c.req.valid("json"),
							userId: user.id,
						}),
					}),
					201,
				);
			}).pipe(
				withKyselyFx(c.get("kysely")),
				withDateFx,
				withTransactionContextFx(),
				withCatchFx({
					NotFoundErrorFx() {
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
