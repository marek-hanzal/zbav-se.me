import { createRoute } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { ListingSchema } from "~/@buyer-user/listing/schema/ListingSchema";
import { thumbCreateFx } from "~/@buyer-user/thumb/fx/thumbCreateFx";
import { ThumbCreateSchema } from "~/@buyer-user/thumb/schema/ThumbCreateSchema";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeError } from "~/@common/notice/noticeError";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { withDateFx } from "~/database/fx/withDateFx";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withCreateApiFx = Effect.fn("withCreateApiFx")(function* () {
	const { buyerUserHono } = yield* RoutesContextFx;
	buyerUserHono.openapi(
		createRoute({
			method: "post",
			path: "/thumb/create",
			description: "Create a new thumb",
			operationId: "apiThumbCreate",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ThumbCreateSchema,
						},
					},
					description: "Data for creating a new thumb",
				},
			},
			responses: {
				201: {
					content: {
						"application/json": {
							schema: ListingSchema,
						},
					},
					description: "The thumb was created and the updated listing is returned",
				},
				400: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Invalid request - duplicate thumb or invalid data",
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
				"Thumb",
			],
			summary: "Create a new thumb for a listing",
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = c.get("user");

				return c.json<ListingSchema.Type, 201>(
					yield* zodFx({
						schema: ListingSchema,
						dataFx: thumbCreateFx({
							...c.req.valid("json"),
							userId: user.id,
						}) satisfies Effect.Effect<ListingSchema.Type, any, any>,
					}),
					201,
				);
			}).pipe(
				withKyselyFx(c.get("kysely")),
				withDateFx,
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{
									_tag: "InvalidRequestError",
								},
								() => c.json(noticeError(e), 400),
							),
							Match.when(
								{
									_tag: "NotFoundErrorFx",
								},
								() => c.json(NotFoundNotice, 404),
							),
							Match.when(
								{
									_tag: "ZodErrorFx",
								},
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
