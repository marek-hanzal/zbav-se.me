import { createRoute } from "@hono/zod-openapi";
import { withCollection, withCount, withFetch } from "@use-pico/common";
import type { Routes } from "../hono/Routes";
import { withSessionHono } from "../hono/withSessionHono";
import { CountSchema } from "../schema/CountSchema";
import { ErrorDtoSchema } from "../schema/ErrorDtoSchema";
import { withCollectionSchema } from "../schema/withCollectionSchema";
import { GalleryDtoSchema } from "./schema/GalleryDtoSchema";
import { GalleryQuerySchema } from "./schema/GalleryQuerySchema";
import { withGalleryQueryBuilder } from "./withGalleryQueryBuilder";
import { withGallerySelect } from "./withGallerySelect";

export const withGalleryApi: Routes.Fn = ({ session }) => {
	const hono = withSessionHono();

	hono.openapi(
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

	hono.openapi(
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

	hono.openapi(
		createRoute({
			method: "post",
			path: "/gallery/count",
			description:
				"Returns count of gallery items based on provided query",
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
			},
			tags: [
				"gallery",
			],
		}),
		async (c) => {
			const { filter, where } = c.req.valid("json");
			return c.json(
				await withCount({
					select: withGallerySelect(),
					filter,
					where,
					query: withGalleryQueryBuilder,
				}),
			);
		},
	);

	session.route("/", hono);
};
