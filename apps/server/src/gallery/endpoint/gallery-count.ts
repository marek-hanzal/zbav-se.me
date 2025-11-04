import { createRoute } from "@hono/zod-openapi";
import { withCount } from "@use-pico/common/count";
import type { Routes } from "../../hono/Routes";
import { CountSchema } from "../../schema/CountSchema";
import { GalleryQuerySchema } from "../schema/GalleryQuerySchema";
import { withGalleryQueryBuilder } from "../withGalleryQueryBuilder";
import { withGallerySelect } from "../withGallerySelect";

export const withGalleryCountApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
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
				"session",
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
};
