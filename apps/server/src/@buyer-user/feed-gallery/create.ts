import { createRoute } from "@hono/zod-openapi";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { feedGalleryCreateFx } from "~/@buyer-user/feed-gallery/fx/feedGalleryCreateFx";
import { FeedGalleryCreateSchema } from "~/@buyer-user/feed-gallery/schema/FeedGalleryCreateSchema";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeError } from "~/@common/notice/noticeError";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { GallerySchema } from "~/@user/gallery/schema/GallerySchema";
import { withDateFx } from "~/database/fx/withDateFx";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";
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
			const axiomConfig = ServerAxiomSchema.parse(process.env);

			return Effect.gen(function* () {
				const user = c.get("user");

				yield* Effect.annotateLogsScoped({
					endpoint: "apiFeedGalleryCreate",
					userId: user.id,
				});

				return c.json(
					yield* zodGuardFx({
						schema: GallerySchema,
						dataFx: feedGalleryCreateFx({
							...c.req.valid("json"),
							userId: user.id,
						}),
					}),
					200,
				);
			}).pipe(
				withKyselyFx(c.get("kysely")),
				withLoggingFx(axiomConfig, "apiFeedGalleryCreate"),
				//
				withDateFx,
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
					ZodErrorFx({ zod }) {
						return c.json(noticeZodError(zod), 500);
					},
				}),
				Effect.runPromise,
			);
		},
	);
});
