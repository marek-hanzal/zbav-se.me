import { createRoute } from "@hono/zod-openapi";
import { withCollection } from "@use-pico/common/collection";
import type { Routes } from "../../hono/Routes";
import { withCollectionSchema } from "../../schema/withCollectionSchema";
import { GalleryDtoSchema } from "../schema/GalleryDtoSchema";
import { GalleryQuerySchema } from "../schema/GalleryQuerySchema";
import { withGalleryQueryBuilder } from "../withGalleryQueryBuilder";
import { withGallerySelect } from "../withGallerySelect";

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
								schema: GalleryDtoSchema,
								type: "GalleryCollection",
								description: "Collection of gallery items",
							}),
						},
					},
					description:
						"Access collection of gallery items based on provided query",
				},
			},
			tags: [
				"gallery",
				"session",
			],
		}),
		async (c) => {
			const { cursor, filter, where, sort } = c.req.valid("json");
			return c.json(
				await withCollection({
					select: withGallerySelect({
						sort,
					}),
					output: GalleryDtoSchema,
					cursor: cursor ?? {
						page: 0,
						size: 10,
					},
					filter,
					where,
					query: withGalleryQueryBuilder,
				}),
			);
		},
	);
};
