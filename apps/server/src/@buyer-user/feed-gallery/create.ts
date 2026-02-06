import { createRoute } from "@hono/zod-openapi";
import { createDateContext, DateContextLayer } from "@use-pico/common/date";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { feedGalleryCreateFx } from "~/@buyer-user/feed-gallery/fx/feedGalleryCreateFx";
import { FeedGalleryCreateSchema } from "~/@buyer-user/feed-gallery/schema/FeedGalleryCreateSchema";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeError } from "~/@common/notice/noticeError";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { GallerySchema } from "~/@user/gallery/schema/GallerySchema";
import { KyselyContextLayer } from "~/database/context/KyselyContextLayer";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withCreateApiFx = Effect.fn("withCreateApiFx")(function* () {
	const { buyerUserHono } = yield* RoutesContextFx;
	buyerUserHono.openapi(
		createRoute({
			method: "post",
			path: "/feed/gallery/create",
			description:
				"Create or update a gallery for a feed. Uses feed.id as gallery.id. If gallery doesn't exist, creates it and attaches uploads.",
			operationId: "apiFeedGalleryCreate",
			request: {
				body: {
					content: {
						"application/json": {
							schema: FeedGalleryCreateSchema,
						},
					},
					description: "Query object for feed gallery creation",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: GallerySchema,
						},
					},
					description: "Gallery created or updated",
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
					description: "Feed not found or not accessible",
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
				"Feed Gallery",
			],
			summary: "Create or update a gallery for a feed.",
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = c.get("user");

				return c.json<GallerySchema.Type, 200>(
					yield* zodFx({
						schema: GallerySchema,
						dataFx: feedGalleryCreateFx({
							...c.req.valid("json"),
							userId: user.id,
						}) satisfies Effect.Effect<GallerySchema.Type, any, any>,
					}),
					200,
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
									_tag: "AccessDeniedError",
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
