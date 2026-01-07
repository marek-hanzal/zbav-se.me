import { createRoute } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { galleryCollectionFx } from "~/app/gallery/fx/galleryCollectionFx";
import { GalleryQuerySchema } from "~/app/gallery/schema/GalleryQuerySchema";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { withCollectionSchema } from "~/schema/withCollectionSchema";
import { GallerySchema } from "./schema/GallerySchema";

const CollectionSchema = withCollectionSchema({
	schema: GallerySchema,
	type: "GalleryCollection",
	description: "Collection of galleries",
});

export const withCollectionApi: Routes.Fn = async ({ userHono }) => {
	userHono.openapi(
		createRoute({
			method: "post",
			path: "/gallery/collection",
			description: "Returns galleries based on provided parameters",
			operationId: "apiGalleryCollection",
			request: {
				body: {
					content: {
						"application/json": {
							schema: GalleryQuerySchema,
						},
					},
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: CollectionSchema,
						},
					},
					description: "Access collection of galleries based on provided query",
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
				"gallery",
				"user",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = c.get("user");

				return c.json<withCollectionSchema.Type<GallerySchema>, 200>(
					yield* zodFx({
						schema: CollectionSchema,
						dataFx: galleryCollectionFx({
							...c.req.valid("json"),
							scope: {
								userId: user.id,
							},
						}),
					}),
					200,
				);
			}).pipe(
				DatabaseContextProvider(c.get("database")),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
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
