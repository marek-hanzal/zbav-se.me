import { createRoute } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { galleryFetchFx } from "~/@user/gallery/fx/galleryFetchFx";
import { GalleryQuerySchema } from "~/@user/gallery/schema/GalleryQuerySchema";
import { GallerySchema } from "~/@user/gallery/schema/GallerySchema";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withFetchApiFx = Effect.fn("withFetchApiFx")(function* () {
	const { userHono } = yield* RoutesContextFx;
	userHono.openapi(
		createRoute({
			method: "post",
			path: "/gallery/fetch",
			description: "Return a gallery based on the provided query",
			operationId: "apiGalleryFetch",
			request: {
				body: {
					content: {
						"application/json": {
							schema: GalleryQuerySchema,
						},
					},
					description: "Query object for gallery fetch",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: GallerySchema,
						},
					},
					description: "Return a gallery based on the provided query",
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
				"Gallery",
			],
			summary: "Fetch a gallery based on the provided query",
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = c.get("user");

				return c.json<GallerySchema.Type, 200>(
					yield* zodFx({
						schema: GallerySchema,
						dataFx: galleryFetchFx({
							...c.req.valid("json"),
							scope: {
								userId: user.id,
							},
						}) satisfies Effect.Effect<GallerySchema.Type, any, any>,
					}),
					200,
				);
			}).pipe(
				withKyselyFx(c.get("kysely")),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{
									_tag: "NotFoundErrorFx",
								},
								() => {
									return c.json(NotFoundNotice, 404);
								},
							),
							Match.when(
								{
									_tag: "ZodErrorFx",
								},
								({ zod }) => {
									return c.json(noticeZodError(zod), 500);
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
