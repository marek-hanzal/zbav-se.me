import { createRoute, z } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { listingGetSellerInfoFx } from "~/@buyer-session/listing/fx/listingGetSellerInfoFx";
import { SellerInfoSchema } from "~/@buyer-session/listing/schema/SellerInfoSchema";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
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
	const { buyerSessionHono } = yield* RoutesContextFx;

	buyerSessionHono.openapi(
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

				const result = c.json<SellerInfoSchema.Type, 200>(
					yield* zodFx({
						schema: SellerInfoSchema,
						dataFx: listingGetSellerInfoFx({
							listingId,
						}) satisfies Effect.Effect<SellerInfoSchema.Type, any, any>,
					}),
					200,
				);

				yield* Effect.log("apiListingSellerInfo");

				return result;
			}).pipe(
				withLoggingFx(axiomConfig),
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
