import { createRoute, z } from "@hono/zod-openapi";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { listingGetSellerInfoFx } from "~/@buyer/listing/fx/listingGetSellerInfoFx";
import { SellerInfoSchema } from "~/@buyer/listing/schema/SellerInfoSchema";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeError } from "~/@common/notice/noticeError";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";
import { NoticeSchema } from "~/schema/NoticeSchema";

const ListingSellerInfoParamsSchema = z
	.object({
		listingId: z.string().openapi({
			description: "ID of the listing",
		}),
	})
	.openapi("ListingSellerInfoParams", {
		description: "Parameters for listing seller info",
	});

export const withSellerInfoApiFx = Effect.fn("withSellerInfoApiFx")(function* () {
	const { buyerHono } = yield* RoutesContextFx;

	buyerHono.openapi(
		createRoute({
			method: "get",
			path: "/listing/{listingId}/seller-info",
			description: "Return seller info for a listing.",
			operationId: "apiListingSellerInfo",
			request: {
				params: ListingSellerInfoParamsSchema,
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: SellerInfoSchema,
						},
					},
					description: "Seller info",
				},
				404: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Listing not found or seller info not available",
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
				"Listing",
			],
			summary: "Return seller info for a listing.",
		}),
		async (c) => {
			const axiomConfig = ServerAxiomSchema.parse(process.env);

			return Effect.gen(function* () {
				const user = c.get("user");
				const { listingId } = c.req.valid("param");

				yield* Effect.annotateLogsScoped({
					endpoint: "apiListingSellerInfo",
					userId: user.id,
				});

				return c.json(
					yield* zodGuardFx({
						schema: SellerInfoSchema,
						dataFx: listingGetSellerInfoFx({
							listingId,
						}),
					}),
					200,
				);
			}).pipe(
				withLoggingFx(axiomConfig, "apiListingSellerInfo", c.get("traceId")),
				withKyselyFx(c.get("kysely")),
				withCatchFx({
					NotFoundErrorFx() {
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
});
