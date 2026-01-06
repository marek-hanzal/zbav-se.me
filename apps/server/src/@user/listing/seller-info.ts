import { createRoute, z } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { listingGetSellerInfoFx } from "~/app/listing/fx/listingGetSellerInfoFx";
import { UserContextProvider } from "~/auth/fx/UserContextFx";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { SellerInfoSchema } from "./schema/SellerInfoSchema";

const ListingSellerInfoParamsSchema = z
	.object({
		listingId: z.string().openapi({
			description: "ID of the listing",
		}),
	})
	.openapi("ListingSellerInfoParams", {
		description: "Parameters for listing seller info",
	});

export const withSellerInfoApi: Routes.Fn = async ({ userHono }) => {
	userHono.openapi(
		createRoute({
			method: "post",
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
				"listing",
				"user",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				const { listingId } = c.req.valid("param");

				return c.json<SellerInfoSchema.Type, 200>(
					yield* zodFx({
						schema: SellerInfoSchema,
						dataFx: listingGetSellerInfoFx({
							listingId,
						}),
					}),
					200,
				);
			}).pipe(
				DatabaseContextProvider(c.get("database")),
				UserContextProvider(c.get("user")),
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
									_tag: "ZodErrorFx",
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
							Match.exhaustive,
						),
					);
				}),
				Effect.runPromise,
			);
		},
	);
};
