import { createRoute } from "@hono/zod-openapi";
import { withFetch } from "@use-pico/common/fetch";
import type { Routes } from "../../hono/Routes";
import { ErrorDtoSchema } from "../../schema/ErrorDtoSchema";
import { GalleryDtoSchema } from "../schema/GalleryDtoSchema";
import { GalleryQuerySchema } from "../schema/GalleryQuerySchema";
import { withGalleryQueryBuilder } from "../withGalleryQueryBuilder";
import { withGallerySelect } from "../withGallerySelect";

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
							schema: GalleryDtoSchema,
						},
					},
					description:
						"Return a gallery item based on the provided query",
				},
				404: {
					content: {
						"application/json": {
							schema: ErrorDtoSchema,
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
				output: GalleryDtoSchema,
				filter,
				where,
				query: withGalleryQueryBuilder,
			});

			if (!result) {
				return c.json(
					{
						message: "Gallery item not found",
					},
					404,
				);
			}

			return c.json(result, 200);
		},
	);
};
