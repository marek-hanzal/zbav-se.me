import { createRoute } from "@hono/zod-openapi";
import { withFetch } from "@use-pico/common/fetch";
import { database } from "../../database/kysely";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { withFeedQueryBuilder } from "./db/withFeedQueryBuilder";
import { withFeedSelect } from "./db/withFeedSelect";
import { FeedPatchSchema } from "./schema/FeedPatchSchema";
import { FeedSchema } from "./schema/FeedSchema";

export const withFeedPatchApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "patch",
			path: "/feed/patch",
			description: "Update an existing feed item",
			operationId: "apiFeedPatch",
			request: {
				body: {
					content: {
						"application/json": {
							schema: FeedPatchSchema,
						},
					},
					description: "Data for updating a feed item",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: FeedSchema,
						},
					},
					description: "The updated feed item",
				},
				404: {
					content: {
						"application/json": {
							schema: MessageSchema,
						},
					},
					description: "Feed item not found",
				},
				500: {
					content: {
						"application/json": {
							schema: MessageSchema,
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
			const { id, name, locationId, filter, meta, sort } = c.req.valid("json");
			const user = c.get("user");
			const now = new Date();

			try {
				const result = await database.kysely
					.updateTable("feed")
					.set({
						name,
						locationId,
						filter: JSON.stringify(filter) as any,
						sort: JSON.stringify(sort) as any,
						meta: JSON.stringify(meta) as any,
						updatedAt: now,
					})
					.where("id", "=", id)
					.where("userId", "=", user.id)
					.executeTakeFirst();

				if (!result.numUpdatedRows) {
					return c.json<MessageSchema.Type, 404>(
						{
							type: "error",
							message: "Feed item not found",
						},
						404,
					);
				}

				const feed = await withFetch({
					select: withFeedSelect({
						sort: [],
					}),
					output: FeedSchema,
					where: {
						id,
					},
					query: withFeedQueryBuilder,
				});

				if (!feed) {
					return c.json<MessageSchema.Type, 404>(
						{
							type: "error",
							message: "Feed item not found after update",
						},
						404,
					);
				}

				return c.json<FeedSchema.Type, 200>(feed, 200);
			} catch (error) {
				console.error(error);
				return c.json<MessageSchema.Type, 500>(
					{
						type: "error",
						message: "Failed to update feed",
					},
					500,
				);
			}
		},
	);
};
