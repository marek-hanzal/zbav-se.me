import { createRoute, z } from "@hono/zod-openapi";
import { createDateContext, DateContextLayer } from "@use-pico/common/date";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { GallerySchema } from "~/@user/gallery/schema/GallerySchema";
import { KyselyContextLayer } from "~/database/context/KyselyContextLayer";
import { RoutesContextFx } from "~/routes/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { draftGalleryCreateFx } from "./fx/draftGalleryCreateFx";
import { DraftGalleryCreateSchema } from "./schema/DraftGalleryCreateSchema";

export const withCreateApiFx = Effect.fn("withCreateApiFx")(function* () {
	const { userHono } = yield* RoutesContextFx;
	userHono.openapi(
		createRoute({
			method: "post",
			path: "/draft/gallery/create",
			description: "Update a draft gallery. Gallery is always created with the draft.",
			operationId: "apiDraftGalleryCreate",
			request: {
				body: {
					content: {
						"application/json": {
							schema: DraftGalleryCreateSchema,
						},
					},
					description: "Query object for draft gallery creation",
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
				403: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Access denied",
				},
				404: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Draft not found or not accessible",
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
				"Draft Gallery",
			],
			summary: "Create a gallery for a draft",
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = c.get("user");

				return c.json<GallerySchema.Type, 200>(
					yield* zodFx({
						schema: GallerySchema,
						dataFx: draftGalleryCreateFx({
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
									_tag: "AccessDeniedError",
								},
								() => {
									return c.json<NoticeSchema.Type, 403>(
										{
											type: "error",
											message: e.message,
										},
										403,
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
