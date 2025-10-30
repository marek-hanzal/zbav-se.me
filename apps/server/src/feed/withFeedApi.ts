import { createRoute } from "@hono/zod-openapi";
import { genId, withCollection, withFetch } from "@use-pico/common";
import { database } from "../database/kysely";
import type { Routes } from "../hono/Routes";
import { withSessionHono } from "../hono/withSessionHono";
import { withCache } from "../redis/withCache";
import { ErrorSchema } from "../schema/ErrorSchema";
import { withCollectionSchema } from "../schema/withCollectionSchema";
import { FeedCreateSchema } from "./schema/FeedCreateSchema";
import { FeedDtoSchema } from "./schema/FeedDtoSchema";
import { FeedPatchSchema } from "./schema/FeedPatchSchema";
import { FeedQuerySchema } from "./schema/FeedQuerySchema";
import { withFeedQueryBuilder } from "./withFeedQueryBuilder";
import { withFeedSelect } from "./withFeedSelect";

export const withFeedApi: Routes.Fn = ({ session }) => {
	const hono = withSessionHono();

	hono.openapi(
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
							schema: ErrorSchema,
						},
					},
					description: "Internal server error",
				},
			},
			tags: [
				"feed",
			],
		}),
		async (c) => {
			const { name, filter, sort } = c.req.valid("json");
			const user = c.get("user");
			const id = genId();
			const now = new Date();

			try {
				await database.kysely
					.insertInto("feed")
					.values({
						id,
						userId: user.id,
						name,
						filter: JSON.stringify(filter) as any,
						sort: JSON.stringify(sort) as any,
						createdAt: now,
						updatedAt: now,
					})
					.execute();

				return c.json(
					await withFetch({
						select: withFeedSelect({}),
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
						message: "Internal server error",
					},
					500,
				);
			}
		},
	);

	hono.openapi(
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
							schema: FeedDtoSchema,
						},
					},
					description: "The updated feed item",
				},
				404: {
					content: {
						"application/json": {
							schema: ErrorSchema,
						},
					},
					description: "Feed item not found",
				},
				500: {
					content: {
						"application/json": {
							schema: ErrorSchema,
						},
					},
					description: "Internal server error",
				},
			},
			tags: [
				"feed",
			],
		}),
		async (c) => {
			const { id, name, filter, sort } = c.req.valid("json");
			const user = c.get("user");
			const now = new Date();

			try {
				const result = await database.kysely
					.updateTable("feed")
					.set({
						name,
						filter: JSON.stringify(filter) as any,
						sort: JSON.stringify(sort) as any,
						updatedAt: now,
					})
					.where("id", "=", id)
					.where("userId", "=", user.id)
					.executeTakeFirst();

				if (!result.numUpdatedRows) {
					return c.json(
						{
							message: "Feed item not found",
						},
						404,
					);
				}

				return c.json(
					await withFetch({
						select: withFeedSelect({}),
						output: FeedDtoSchema,
						where: {
							id,
						},
						query: withFeedQueryBuilder,
					}),
					200,
				);
			} catch (error) {
				console.error(error);
				return c.json(
					{
						message: "Internal server error",
					},
					500,
				);
			}
		},
	);

	hono.openapi(
		createRoute({
			method: "post",
			path: "/feed/fetch",
			description: "Return a feed item based on the provided query",
			operationId: "apiFeedFetch",
			request: {
				body: {
					content: {
						"application/json": {
							schema: FeedQuerySchema,
						},
					},
					description: "Query object for feed fetch",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: FeedDtoSchema,
						},
					},
					description:
						"Return a feed item based on the provided query",
				},
				404: {
					content: {
						"application/json": {
							schema: ErrorSchema,
						},
					},
					description: "Feed item not found",
				},
			},
			tags: [
				"feed",
			],
		}),
		async (c) => {
			const json = c.req.valid("json");
			const { filter, where, sort } = json;

			const { data, hit } = await withCache({
				key: {
					scope: "feed:fetch",
					version: "1",
					value: json,
				},
				fetch: () =>
					withFetch({
						select: withFeedSelect({
							sort,
						}),
						output: FeedDtoSchema,
						filter,
						where,
						query: withFeedQueryBuilder,
					}),
			});

			if (!data) {
				return c.json(
					{
						message: "Feed item not found",
					},
					404,
				);
			}
			return c.json(data satisfies FeedDtoSchema.Type, {
				status: 200,
				headers: {
					"X-Cached": hit ? "true" : "false",
				},
			});
		},
	);

	hono.openapi(
		createRoute({
			method: "post",
			path: "/feed/collection",
			description: "Returns feed items based on provided parameters",
			operationId: "apiFeedCollection",
			request: {
				body: {
					content: {
						"application/json": {
							schema: FeedQuerySchema,
						},
					},
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: withCollectionSchema({
								schema: FeedDtoSchema,
								type: "FeedCollection",
								description: "Collection of feed items",
							}),
						},
					},
					description:
						"Access collection of feed items based on provided query",
				},
			},
			tags: [
				"feed",
			],
		}),
		async (c) => {
			const json = c.req.valid("json");
			const { cursor, filter, where, sort } = json;

			const { data, hit } = await withCache({
				key: {
					scope: "feed:collection",
					version: "1",
					value: json,
				},
				fetch: () =>
					withCollection({
						select: withFeedSelect({
							sort,
						}),
						output: FeedDtoSchema,
						cursor: cursor ?? {
							page: 0,
							size: 10,
						},
						filter,
						where,
						query: withFeedQueryBuilder,
					}),
			});

			return c.json(data, {
				headers: {
					"X-Cached": hit ? "true" : "false",
				},
			});
		},
	);

	session.route("/", hono);
};
