import { createRoute } from "@hono/zod-openapi";
import { withCount } from "@use-pico/common/count";
import type { Routes } from "../../hono/Routes";
import { CountSchema } from "../../schema/CountSchema";
import { UploadQuerySchema } from "../schema/UploadQuerySchema";
import { withUploadQueryBuilder } from "../withUploadQueryBuilder";
import { withUploadSelect } from "../withUploadSelect";

export const withUploadCountApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/upload/count",
			description:
				"Returns count of upload items based on provided query",
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
					select: withUploadSelect(),
					filter,
					where,
					query: withUploadQueryBuilder,
				}),
			);
		},
	);
};
