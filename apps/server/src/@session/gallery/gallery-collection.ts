import { createRoute } from "@hono/zod-openapi";
import { withCollection } from "@use-pico/common/collection";
import type { Routes } from "../../hono/Routes";
import { withCollectionSchema } from "../../schema/withCollectionSchema";
import { withGalleryQueryBuilder } from "./db/withGalleryQueryBuilder";
import { withGallerySelect } from "./db/withGallerySelect";
import { GalleryQuerySchema } from "./schema/GalleryQuerySchema";
import { GallerySchema } from "./schema/GallerySchema";

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
			},
			tags: [
				"gallery",
				"session",
			],
		}),
		async (c) => {
			const { cursor, filter, where, sort } = c.req.valid("json");
			return c.json<withCollectionSchema.Type<GallerySchema>, 200>(
				await withCollection({
					select: withGallerySelect({
						sort,
					}),
					output: GallerySchema,
					cursor: cursor ?? {
						page: 0,
						size: 10,
					},
					filter,
					where,
					query: withGalleryQueryBuilder,
				}),
				200,
			);
		},
	);
};
