import { createRoute } from "@hono/zod-openapi";
import { withFetch } from "@use-pico/common/fetch";
import { database } from "../../database/kysely";
import type { Routes } from "../../hono/Routes";
import { ErrorDtoSchema } from "../../schema/ErrorDtoSchema";
import { LocationDtoSchema } from "../schema/LocationDtoSchema";
import { LocationQuerySchema } from "../schema/LocationQuerySchema";
import { withLocationQueryBuilder } from "../withLocationQueryBuilder";
import { withLocationSelect } from "../withLocationSelect";

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
							schema: LocationDtoSchema,
						},
					},
					description:
						"Return a location based on the provided query",
				},
				404: {
					content: {
						"application/json": {
							schema: ErrorDtoSchema,
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
				output: LocationDtoSchema,
				filter,
				where,
				query: withLocationQueryBuilder,
			});

			if (!result) {
				return c.json(
					{
						message: "Location not found",
					},
					404,
				);
			}

			return c.json(result, 200);
		},
	);
};
