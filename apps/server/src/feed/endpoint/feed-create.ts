import { createRoute } from "@hono/zod-openapi";
import { withFetch } from "@use-pico/common/fetch";
import { genId } from "@use-pico/common/gen-id";
import { database } from "../../database/kysely";
import type { Routes } from "../../hono/Routes";
import { ErrorDtoSchema } from "../../schema/ErrorDtoSchema";
import { FeedCreateSchema } from "../schema/FeedCreateSchema";
import { FeedDtoSchema } from "../schema/FeedDtoSchema";
import { withFeedQueryBuilder } from "../withFeedQueryBuilder";
import { withFeedSelect } from "../withFeedSelect";

export const withFeedCreateApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/feed/create",
			description: "Create a new feed item",
			operationId: "apiFeedCreate",
			request: {
				body: {
					content: {
						"application/json": {
							schema: FeedCreateSchema,
						},
					},
					description: "Data for creating a new feed item",
				},
			},
			responses: {
				201: {
					content: {
						"application/json": {
							schema: FeedDtoSchema,
						},
					},
					description: "The created feed item",
				},
				500: {
					content: {
						"application/json": {
							schema: ErrorDtoSchema,
						},
					},
					description: "Internal server error",
				},
			},
			tags: [
				"feed",
				"session",
			],
		}),
		async (c) => {
			const { name, locationId, filter, sort, meta } =
				c.req.valid("json");
			const user = c.get("user");
			const id = genId();
			const now = new Date();

			try {
				await database.kysely
					.insertInto("feed")
					.values({
						id,
						userId: user.id,
						locationId,
						name,
						filter: JSON.stringify(filter) as any,
						sort: JSON.stringify(sort) as any,
						meta: JSON.stringify(meta) as any,
						createdAt: now,
						updatedAt: now,
					})
					.execute();

				return c.json(
					await withFetch({
						select: withFeedSelect({
							sort: [],
						}),
						output: FeedDtoSchema,
						where: {
							id,
						},
						query: withFeedQueryBuilder,
					}),
					201,
				);
			} catch (error) {
				console.error(error);
				return c.json(
					{
						message: "Failed to create feed",
					} satisfies ErrorDtoSchema.Type,
					500,
				);
			}
		},
	);
};
