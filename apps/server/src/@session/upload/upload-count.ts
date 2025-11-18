import { createRoute } from "@hono/zod-openapi";
import { withCount } from "@use-pico/common/count";
import type { Routes } from "../../hono/Routes";
import { CountSchema } from "../../schema/CountSchema";
import { withUploadQueryBuilder } from "./db/withUploadQueryBuilder";
import { withUploadSelect } from "./db/withUploadSelect";
import { UploadQuerySchema } from "./schema/UploadQuerySchema";

export const withUploadCountApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/upload/count",
			description: "Returns count of upload items based on provided query",
			operationId: "apiUploadCount",
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
							schema: CountSchema,
						},
					},
					description: "Return counts based on provided query",
				},
			},
			tags: [
				"upload",
				"session",
			],
		}),
		async (c) => {
			const { filter, where } = c.req.valid("json");
			return c.json(
				await withCount({
					select: withUploadSelect({
						database: c.get("database"),
					}),
					filter,
					where,
					query: withUploadQueryBuilder,
				}),
			);
		},
	);
};
