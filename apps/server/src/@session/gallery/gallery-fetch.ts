import { createRoute } from "@hono/zod-openapi";
import { Effect } from "effect";
import { match } from "ts-pattern";
import { database } from "../../database/kysely";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { GalleryQuerySchema } from "./schema/GalleryQuerySchema";
import { GallerySchema } from "./schema/GallerySchema";
import { galleryFetchFx } from "./service/galleryFetchFx";

export const withGalleryFetchApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/gallery/fetch",
			description: "Return a gallery item based on the provided query",
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
					description: "Return a gallery item based on the provided query",
				},
				404: {
					content: {
						"application/json": {
							schema: MessageSchema,
						},
					},
					description: "Gallery item not found",
				},
			},
			tags: [
				"gallery",
				"session",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return yield* galleryFetchFx({
					database: database.kysely,
					query: c.req.valid("json"),
				});
			}).pipe(
				Effect.matchEffect({
					onSuccess(gallery) {
						return Effect.succeed(c.json<GallerySchema.Type, 200>(gallery, 200));
					},
					onFailure(e) {
						return Effect.succeed(
							match(e)
								.with(
									{
										_tag: "NotFoundError",
									},
									() => {
										return c.json<MessageSchema.Type, 404>(
											{
												type: "error",
												message: e.message,
											},
											404,
										);
									},
								)
								.exhaustive(),
						);
					},
				}),
				Effect.runPromise,
			);
		},
	);
};
