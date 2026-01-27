import { createRoute, z } from "@hono/zod-openapi";
import { createDateContext, DateContextLayer } from "@use-pico/common/date";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { ListingEventSchema } from "~/@user/listing-event/schema/ListingEventSchema";
import { KyselyContextLayer } from "~/database/context/KyselyContextLayer";
import { RoutesContextFx } from "~/routes/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { listingEventCreateFx } from "./fx/listingEventCreateFx";
import { ListingEventCreateSchema } from "./schema/ListingEventCreateSchema";

export const withCreateApiFx = Effect.fn("withCreateApiFx")(function* () {
	const { userHono } = yield* RoutesContextFx;
	userHono.openapi(
		createRoute({
			method: "post",
			path: "/listing-event/create",
			description: "Create a new listing event",
			operationId: "apiListingEventCreate",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ListingEventCreateSchema,
						},
					},
					description: "Data for creating a new listing event",
				},
			},
			responses: {
				201: {
					content: {
						"application/json": {
							schema: ListingEventSchema,
						},
					},
					description: "The listing event was created",
				},
				400: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Cannot create event on your own listing",
				},
				429: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Too many requests - please wait between events",
				},
				404: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Listing not found",
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
				"Listing Event",
			],
			summary: "Create a new listing event",
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = c.get("user");

				return c.json<ListingEventSchema.Type, 201>(
					yield* zodFx({
						schema: ListingEventSchema,
						dataFx: listingEventCreateFx({
							...c.req.valid("json"),
							userId: user.id,
						}) satisfies Effect.Effect<ListingEventSchema.Type, any, any>,
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
								{
									_tag: "InvalidRequestError",
								},
								() => {
									return c.json<NoticeSchema.Type, 400>(
										{
											type: "error",
											message: e.message,
										},
										400,
									);
								},
							),
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
									_tag: "TooManyRequests",
								},
								() => {
									return c.json<NoticeSchema.Type, 429>(
										{
											type: "error",
											message: e.message,
										},
										429,
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
