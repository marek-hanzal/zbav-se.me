import { createRoute } from "@hono/zod-openapi";
import { Effect } from "effect";
import { match } from "ts-pattern";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { withCollectionSchema } from "../../schema/withCollectionSchema";
import { GalleryQuerySchema } from "./schema/GalleryQuerySchema";
import { GallerySchema } from "./schema/GallerySchema";
import { galleryCollectionFx } from "./service/galleryCollectionFx";

export const withGalleryCollectionApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/gallery/collection",
			description: "Returns gallery items based on provided parameters",
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
							schema: withCollectionSchema({
								schema: GallerySchema,
								type: "GalleryCollection",
								description: "Collection of gallery items",
							}),
						},
					},
					description: "Access collection of gallery items based on provided query",
				},
				500: {
					content: {
						"application/json": {
							schema: MessageSchema,
						},
					},
					description: "Internal server error",
				},
			},
			tags: [
				"gallery",
				"session",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return yield* galleryCollectionFx({
					database: c.get("database"),
					query: c.req.valid("json"),
				});
			}).pipe(
				Effect.matchEffect({
					onSuccess(collection) {
						return Effect.succeed(
							c.json<withCollectionSchema.Type<GallerySchema>, 200>(collection, 200),
						);
					},
					onFailure(e) {
						/**
						 * This just holds type exhaustive match for errors if any comes up.
						 */
						match(e).exhaustive();

						return Effect.succeed(
							c.json<MessageSchema.Type, 500>(
								{
									type: "error",
									message: "This should not happen",
								},
								500,
							),
						);
					},
				}),
				Effect.runPromise,
			);
		},
	);
};
