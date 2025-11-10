import { createRoute } from "@hono/zod-openapi";
import { withFetch } from "@use-pico/common/fetch";
import { genId } from "@use-pico/common/gen-id";
import { database } from "../../database/kysely";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { withFeedQueryBuilder } from "./db/withFeedQueryBuilder";
import { withFeedSelect } from "./db/withFeedSelect";
import { FeedCreateSchema } from "./schema/FeedCreateSchema";
import { FeedSchema } from "./schema/FeedSchema";

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
							schema: FeedSchema,
						},
					},
					description: "The created feed item",
				},
				404: {
					content: {
						"application/json": {
							schema: MessageSchema,
						},
					},
					description: "Feed not found after creation",
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
						filter: JSON.stringify({
							...filter,
							withOwn: false,
							withIgnored: false,
						}) as any,
						sort: JSON.stringify(sort) as any,
						meta: JSON.stringify(meta) as any,
						createdAt: now,
						updatedAt: now,
					})
					.execute();

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
							message: "Feed not found",
						},
						404,
					);
				}

				return c.json<FeedSchema.Type, 201>(feed, 201);
			} catch (error) {
				console.error(error);
				return c.json<MessageSchema.Type, 500>(
					{
						type: "error",
						message: "Failed to create feed",
					},
					500,
				);
			}
		},
	);
};
