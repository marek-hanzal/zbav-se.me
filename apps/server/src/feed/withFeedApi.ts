import { createRoute } from "@hono/zod-openapi";
import { genId, withFetch } from "@use-pico/common";
import { database } from "../database/kysely";
import type { Routes } from "../hono/Routes";
import { withSessionHono } from "../hono/withSessionHono";
import { ErrorSchema } from "../schema/ErrorSchema";
import { FeedCreateSchema } from "./schema/FeedCreateSchema";
import { FeedDtoSchema } from "./schema/FeedDtoSchema";
import { FeedPatchSchema } from "./schema/FeedPatchSchema";
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
			const { listing } = c.req.valid("json");
			const user = c.get("user");
			const id = genId();
			const now = new Date();

			try {
				await database.kysely
					.insertInto("feed")
					.values({
						id,
						userId: user.id,
						listing,
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
			const {
				id,
				listing: { id: _, ...listing },
			} = c.req.valid("json");
			const user = c.get("user");
			const now = new Date();

			try {
				const result = await database.kysely
					.updateTable("feed")
					.set({
						...listing,
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

	session.route("/", hono);
};
