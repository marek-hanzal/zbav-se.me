import { createRoute } from "@hono/zod-openapi";
import { withFetch } from "@use-pico/common/fetch";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { withUploadQueryBuilder } from "./db/withUploadQueryBuilder";
import { withUploadSelect } from "./db/withUploadSelect";
import { UploadQuerySchema } from "./schema/UploadQuerySchema";
import { UploadSchema } from "./schema/UploadSchema";

export const withUploadFetchApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/upload/fetch",
			description: "Return an upload item based on the provided query",
			operationId: "apiUploadFetch",
			request: {
				body: {
					content: {
						"application/json": {
							schema: UploadQuerySchema,
						},
					},
					description: "Query object for upload fetch",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: UploadSchema,
						},
					},
					description: "Return an upload item based on the provided query",
				},
				404: {
					content: {
						"application/json": {
							schema: MessageSchema,
						},
					},
					description: "Upload not found",
				},
			},
			tags: [
				"upload",
				"session",
			],
		}),
		async (c) => {
			const { filter, where, sort } = c.req.valid("json");

			const result = await withFetch({
				select: withUploadSelect({
					sort,
				}),
				output: UploadSchema,
				filter,
				where,
				query: withUploadQueryBuilder,
			});

			if (!result) {
				return c.json<MessageSchema.Type, 404>(
					{
						type: "error",
						message: "Upload not found",
					},
					404,
				);
			}

			return c.json<UploadSchema.Type, 200>(result, 200);
		},
	);
};
