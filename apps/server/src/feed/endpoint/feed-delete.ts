import { createRoute } from "@hono/zod-openapi";
import { withFetch } from "@use-pico/common/fetch";
import { database } from "../../database/kysely";
import type { Routes } from "../../hono/Routes";
import { ErrorDtoSchema } from "../../schema/ErrorDtoSchema";
import { FeedDtoSchema } from "../schema/FeedDtoSchema";
import { FeedQuerySchema } from "../schema/FeedQuerySchema";
import { withFeedQueryBuilder } from "../withFeedQueryBuilder";
import { withFeedSelect } from "../withFeedSelect";

export const withFeedDeleteApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "delete",
			path: "/feed/delete",
			description:
				"Delete a feed item based on the provided query (user-specific)",
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
							schema: FeedDtoSchema,
						},
					},
					description: "The deleted feed item",
				},
				404: {
					content: {
						"application/json": {
							schema: ErrorDtoSchema,
						},
					},
					description: "Feed item not found",
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
			const json = c.req.valid("json");
			const user = c.get("user");
			const { filter, where } = json;

			try {
				const feed = await database.kysely
					.transaction()
					.execute(async (trx) => {
						const feed = await withFetch({
							select: withFeedSelect({
								sort: [],
							}),
							output: FeedDtoSchema,
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

						// Delete the feed
						await trx
							.deleteFrom("feed")
							.where("id", "=", feed.id)
							.where("userId", "=", user.id)
							.execute();

						return feed;
					});

				if (!feed) {
					return c.json(
						{
							message: "Feed item not found",
						},
						404,
					);
				}

				return c.json(feed satisfies FeedDtoSchema.Type, 200);
			} catch (error) {
				console.error(error);
				return c.json(
					{
						message: "Failed to delete feed",
					} satisfies ErrorDtoSchema.Type,
					500,
				);
			}
		},
	);
};
