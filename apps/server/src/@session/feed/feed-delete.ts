import { createRoute } from "@hono/zod-openapi";
import { withFetch } from "@use-pico/common/fetch";
import { database } from "../../database/kysely";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { withFeedQueryBuilder } from "./db/withFeedQueryBuilder";
import { withFeedSelect } from "./db/withFeedSelect";
import { FeedQuerySchema } from "./schema/FeedQuerySchema";
import { FeedSchema } from "./schema/FeedSchema";

export const withFeedDeleteApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "delete",
			path: "/feed/delete",
			description: "Delete a feed item based on the provided query (user-specific)",
			operationId: "apiFeedDelete",
			request: {
				body: {
					content: {
						"application/json": {
							schema: FeedQuerySchema,
						},
					},
					description: "Query object for feed deletion",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: FeedSchema,
						},
					},
					description: "The deleted feed item",
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
			const json = c.req.valid("json");
			const user = c.get("user");
			const { filter, where } = json;

			try {
				const feed = await database.kysely.transaction().execute(async (trx) => {
					const feed = await withFetch({
						select: withFeedSelect({
							sort: [],
						}),
						output: FeedSchema,
						filter,
						where: {
							...where,
							userId: user.id,
						},
						query: withFeedQueryBuilder,
					});

					if (!feed) {
						return null;
					}

					await trx
						.deleteFrom("feed")
						.where("id", "=", feed.id)
						.where("userId", "=", user.id)
						.execute();

					return feed;
				});

				if (!feed) {
					return c.json<MessageSchema.Type, 404>(
						{
							type: "error",
							message: "Feed item not found",
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
						message: "Failed to delete feed",
					},
					500,
				);
			}
		},
	);
};
