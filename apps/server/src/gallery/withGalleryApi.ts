import { createRoute, z } from "@hono/zod-openapi";
import { withCount, withFetch, withList } from "@use-pico/common";
import { database } from "../database/kysely";
import { CountSchema } from "../schema/CountSchema";
import { withSessionHono } from "../withSessionHono";
import { GalleryQuerySchema } from "./schema/GalleryQuerySchema";
import { GallerySchema } from "./schema/GallerySchema";
import {
	withGalleryQueryBuilder,
	withGalleryQueryBuilderWithSort,
} from "./withGalleryQueryBuilder";

export const withGalleryApi = withSessionHono();

withGalleryApi.openapi(
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
		},
		tags: [
			"gallery",
		],
	}),
	async ({ json, req }) => {
		const { filter, where, sort } = req.valid("json");
		return json(
			await withFetch({
				select: database.kysely.selectFrom("Gallery").selectAll(),
				output: GallerySchema,
				filter,
				where,
				query({ select, where }) {
					return withGalleryQueryBuilderWithSort({
						select,
						where,
						sort,
					});
				},
			}),
		);
	},
);

withGalleryApi.openapi(
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
						schema: z.array(GallerySchema),
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
	async ({ json, req }) => {
		const { cursor, filter, where, sort } = req.valid("json");
		return json(
			await withList({
				select: database.kysely.selectFrom("Gallery").selectAll(),
				output: GallerySchema,
				cursor,
				filter,
				where,
				query({ select, where }) {
					return withGalleryQueryBuilderWithSort({
						select,
						where,
						sort,
					});
				},
			}),
		);
	},
);

withGalleryApi.openapi(
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
		},
		tags: [
			"gallery",
		],
	}),
	async ({ json, req }) => {
		const { filter, where } = req.valid("json");
		return json(
			await withCount({
				select: database.kysely.selectFrom("Gallery").selectAll(),
				filter,
				where,
				query({ select, where }) {
					return withGalleryQueryBuilder({
						select,
						where,
					});
				},
			}),
		);
	},
);
