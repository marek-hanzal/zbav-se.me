import { createRoute, z } from "@hono/zod-openapi";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeError } from "~/@common/notice/noticeError";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { withTransactionContextFx } from "~/@common/transaction/context/withTransactionContextFx";
import { transactionEntryCreateFx } from "~/@user/transaction-entry/fx/transactionEntryCreateFx";
import { GallerySchema } from "~/@user/transaction-entry/schema/TransactionEntryCreateSchema/GallerySchema";
import { LocationSchema } from "~/@user/transaction-entry/schema/TransactionEntryCreateSchema/LocationSchema";
import { PackageSchema } from "~/@user/transaction-entry/schema/TransactionEntryCreateSchema/PackageSchema";
import { PersonalSchema } from "~/@user/transaction-entry/schema/TransactionEntryCreateSchema/PersonalSchema";
import { TextSchema } from "~/@user/transaction-entry/schema/TransactionEntryCreateSchema/TextSchema";
import { TransactionEntrySchema } from "~/@user/transaction-entry/schema/TransactionEntrySchema";
import { withDateFx } from "~/database/fx/withDateFx";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";

const CreateSchema = z
	.discriminatedUnion("kind", [
		TextSchema,
		GallerySchema,
		LocationSchema,
		PackageSchema,
		PersonalSchema,
	])
	.openapi("TransactionEntryCreate", {
		description: "Request to append one user-authored transaction entry",
	});

export const withTransactionEntryCreateApiFx = Effect.fn("withTransactionEntryCreateApiFx")(
	function* () {
		const { userHono } = yield* RoutesContextFx;

		userHono.openapi(
			createRoute({
				method: "post",
				path: "/transaction-entry/create",
				description: "Appends one user-authored transaction entry",
				operationId: "apiTransactionEntryCreate",
				request: {
					body: {
						content: {
							"application/json": {
								schema: CreateSchema,
							},
						},
					},
				},
				responses: {
					201: {
						content: {
							"application/json": {
								schema: TransactionEntrySchema,
							},
						},
						description: "Created transaction entry",
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
						description: "Transaction not found or inaccessible",
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
					"Transaction Entry",
				],
				summary: "Create one transaction entry",
			}),
			async (c) => {
				return Effect.gen(function* () {
					const user = c.get("user");

					return c.json(
						yield* zodGuardFx({
							schema: TransactionEntrySchema,
							dataFx: transactionEntryCreateFx({
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
						InvalidRequestErrorFx(e) {
							return c.json(noticeError(e), 400);
						},
						NotFoundErrorFx() {
							return c.json(NotFoundNotice, 404);
						},
						AccessDeniedErrorFx() {
							return c.json(NotFoundNotice, 404);
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
	},
);
