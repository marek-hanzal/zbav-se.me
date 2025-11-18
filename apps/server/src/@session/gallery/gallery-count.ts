import { createRoute } from "@hono/zod-openapi";
import { Effect } from "effect";
import { match } from "ts-pattern";
import { database } from "../../database/kysely";
import type { Routes } from "../../hono/Routes";
import { CountSchema } from "../../schema/CountSchema";
import { MessageSchema } from "../../schema/MessageSchema";
import { GalleryQuerySchema } from "./schema/GalleryQuerySchema";
import { galleryCountFx } from "./service/galleryCountFx";

export const withGalleryCountApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/gallery/count",
			description: "Returns count of gallery items based on provided query",
			operationId: "apiGalleryCount",
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
							schema: CountSchema,
						},
					},
					description: "Return counts based on provided query",
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
				return yield* galleryCountFx({
					database: database.kysely,
					query: c.req.valid("json"),
				});
			}).pipe(
				Effect.matchEffect({
					onSuccess(count) {
						return Effect.succeed(c.json<CountSchema.Type, 200>(count, 200));
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
