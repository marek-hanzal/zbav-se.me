import { createRoute } from "@hono/zod-openapi";
import { withFetch } from "@use-pico/common/fetch";
import type { Routes } from "../../hono/Routes";
import { ErrorDtoSchema } from "../../schema/ErrorDtoSchema";
import { UploadDtoSchema } from "../schema/UploadDtoSchema";
import { UploadQuerySchema } from "../schema/UploadQuerySchema";
import { withUploadQueryBuilder } from "../withUploadQueryBuilder";
import { withUploadSelect } from "../withUploadSelect";

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
							schema: UploadDtoSchema,
						},
					},
					description:
						"Return an upload item based on the provided query",
				},
				404: {
					content: {
						"application/json": {
							schema: ErrorDtoSchema,
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
				output: UploadDtoSchema,
				filter,
				where,
				query: withUploadQueryBuilder,
			});

			if (!result) {
				return c.json(
					{
						message: "Upload not found",
					} satisfies ErrorDtoSchema.Type,
					404,
				);
			}

			return c.json(result, 200);
		},
	);
};
