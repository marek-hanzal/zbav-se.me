import { createRoute } from "@hono/zod-openapi";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { GallerySchema } from "~/@user/gallery/schema/GallerySchema";
import { transactionEntryGalleryFetchFx } from "~/@user/transaction-entry/fx/transactionEntryGalleryFetchFx";
import { TransactionEntryGalleryQuerySchema } from "~/@user/transaction-entry/schema/TransactionEntryGalleryQuerySchema";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withTransactionEntryGalleryFetchApiFx = Effect.fn(
	"withTransactionEntryGalleryFetchApiFx",
)(function* () {
	const { userHono } = yield* RoutesContextFx;

	userHono.openapi(
		createRoute({
			method: "post",
			path: "/transaction-entry/gallery/fetch",
			description:
				"Returns a gallery linked to a transaction entry when the current user is a participant of the transaction",
			operationId: "apiTransactionEntryGalleryFetch",
			request: {
				body: {
					content: {
						"application/json": {
							schema: TransactionEntryGalleryQuerySchema,
						},
					},
					description: "Transaction-entry gallery query object",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: GallerySchema,
						},
					},
					description: "Gallery linked to the requested transaction entry",
				},
				404: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Gallery not found",
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
			summary: "Fetch gallery for one transaction entry",
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = c.get("user");

				return c.json(
					yield* zodGuardFx({
						schema: GallerySchema,
						dataFx: transactionEntryGalleryFetchFx({
							...c.req.valid("json"),
							userId: user.id,
						}),
					}),
					200,
				);
			}).pipe(
				withKyselyFx(c.get("kysely")),
				withCatchFx({
					NotFoundErrorFx() {
						return c.json(NotFoundNotice, 404);
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
