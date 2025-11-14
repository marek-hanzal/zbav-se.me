import { createRoute } from "@hono/zod-openapi";
import { withFetch } from "@use-pico/common/fetch";
import { database } from "../../database/kysely";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { withLocationQueryBuilder } from "./db/withLocationQueryBuilder";
import { withLocationSelect } from "./db/withLocationSelect";
import { LocationQuerySchema } from "./schema/LocationQuerySchema";
import { LocationSchema } from "./schema/LocationSchema";

export const withLocationFetchApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/location/fetch",
			description: "Return a location based on the provided query",
			operationId: "apiLocationFetch",
			request: {
				body: {
					content: {
						"application/json": {
							schema: LocationQuerySchema,
						},
					},
					description: "Query object for location fetch",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: LocationSchema,
						},
					},
					description: "Return a location based on the provided query",
				},
				404: {
					content: {
						"application/json": {
							schema: MessageSchema,
						},
					},
					description: "Location not found",
				},
			},
			tags: [
				"location",
				"session",
			],
		}),
		async (c) => {
			const { filter, where, sort } = c.req.valid("json");

			const result = await withFetch({
				select: withLocationSelect({
					sort,
					source: database.kysely,
				}),
				output: LocationSchema,
				filter,
				where,
				query: withLocationQueryBuilder,
			});

			if (!result) {
				return c.json<MessageSchema.Type, 404>(
					{
						type: "error",
						message: "Location not found",
					},
					404,
				);
			}

			return c.json<LocationSchema.Type, 200>(result, 200);
		},
	);
};
