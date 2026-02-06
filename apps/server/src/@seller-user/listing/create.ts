import { createRoute } from "@hono/zod-openapi";
import { createDateContext, DateContextLayer } from "@use-pico/common/date";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeError } from "~/@common/notice/noticeError";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { listingCreateFx } from "~/@seller-user/listing/fx/listingCreateFx";
import { ListingCreateSchema } from "~/@seller-user/listing/schema/ListingCreateSchema";
import { ListingSchema } from "~/@seller-user/listing/schema/ListingSchema";
import { KyselyContextLayer } from "~/database/context/KyselyContextLayer";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withCreateApiFx = Effect.fn("withCreateApiFx")(function* () {
	const { sellerUserHono } = yield* RoutesContextFx;
	sellerUserHono.openapi(
		createRoute({
			method: "post",
			path: "/listing/create",
			description: "Create a new listing",
			operationId: "apiListingCreate",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingCreateSchema,
						},
					},
					description: "Data for creating a new listing",
				},
			},
			responses: {
				201: {
					content: {
						"application/json": {
							schema: ListingSchema,
						},
					},
					description: "The created listing",
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
					description: "Listing not found after creation",
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
			summary: "Create a new listing",
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = c.get("user");

				return c.json<ListingSchema.Type, 201>(
					yield* zodFx({
						schema: ListingSchema,
						dataFx: listingCreateFx({
							...c.req.valid("json"),
							userId: user.id,
						}) satisfies Effect.Effect<ListingSchema.Type, any, any>,
					}),
					201,
				);
			}).pipe(
				Effect.provide(KyselyContextLayer(c.get("kysely"))),
				Effect.provide(DateContextLayer(createDateContext())),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{ _tag: "NotFoundErrorFx" },
								() => c.json(NotFoundNotice, 404),
							),
							Match.when(
								{ _tag: "InvalidRequestError" },
								() => c.json(noticeError(e), 400),
							),
							Match.when(
								{ _tag: "ZodErrorFx" },
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
