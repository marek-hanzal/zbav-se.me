import { createRoute } from "@hono/zod-openapi";
import { withFetch } from "@use-pico/common/fetch";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { withGalleryQueryBuilder } from "./db/withGalleryQueryBuilder";
import { withGallerySelect } from "./db/withGallerySelect";
import { GalleryQuerySchema } from "./schema/GalleryQuerySchema";
import { GallerySchema } from "./schema/GallerySchema";

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
					description:
						"Return a gallery item based on the provided query",
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
			const { filter, where, sort } = c.req.valid("json");

			const result = await withFetch({
				select: withGallerySelect({
					sort,
				}),
				output: GallerySchema,
				filter,
				where,
				query: withGalleryQueryBuilder,
			});

			if (!result) {
				return c.json<MessageSchema.Type, 404>(
					{
						type: "error",
						message: "Gallery item not found",
					},
					404,
				);
			}

			return c.json<GallerySchema.Type, 200>(result, 200);
		},
	);
};
