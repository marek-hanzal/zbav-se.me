import { createRoute } from "@hono/zod-openapi";
import { withCollection } from "@use-pico/common/collection";
import type { Routes } from "../../hono/Routes";
import { withCollectionSchema } from "../../schema/withCollectionSchema";
import { withUploadQueryBuilder } from "./db/withUploadQueryBuilder";
import { withUploadSelect } from "./db/withUploadSelect";
import { UploadQuerySchema } from "./schema/UploadQuerySchema";
import { UploadSchema } from "./schema/UploadSchema";

export const withUploadCollectionApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/upload/collection",
			description: "Returns upload items based on provided parameters",
			operationId: "apiUploadCollection",
			request: {
				body: {
					content: {
						"application/json": {
							schema: UploadQuerySchema,
						},
					},
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: withCollectionSchema({
								schema: UploadSchema,
								type: "UploadCollection",
								description: "Collection of upload items",
							}),
						},
					},
					description: "Access collection of upload items based on provided query",
				},
			},
			tags: [
				"upload",
				"session",
			],
		}),
		async (c) => {
			const { cursor, filter, where, sort } = c.req.valid("json");
			return c.json(
				await withCollection({
					select: withUploadSelect({
						sort,
					}),
					output: UploadSchema,
					cursor: cursor ?? {
						page: 0,
						size: 10,
					},
					filter,
					where,
					query: withUploadQueryBuilder,
				}),
			);
		},
	);
};
