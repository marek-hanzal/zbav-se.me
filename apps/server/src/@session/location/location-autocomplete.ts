import { createRoute, z } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { LocationAutocompleteSchema } from "./schema/LocationAutocompleteSchema";
import { LocationSchema } from "./schema/LocationSchema";
import { locationAutocompleteFx } from "./service/locationAutocompleteFx";

export const withLocationAutocompleteApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/location/autocomplete",
			description: "Return a location autocomplete",
			operationId: "apiLocationAutocomplete",
			request: {
				body: {
					content: {
						"application/json": {
							schema: LocationAutocompleteSchema,
						},
					},
					description: "Request body for location autocomplete",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: z.array(LocationSchema),
						},
					},
					description: "Location(s) found (cache hit)",
				},
				201: {
					content: {
						"application/json": {
							schema: z.array(LocationSchema),
						},
					},
					description: "Location(s) created (cache miss)",
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
				"location",
				"session",
			],
		}),
		async (c) => {
			const { text, lang } = c.req.valid("json");

			return Effect.gen(function* () {
				const result = yield* locationAutocompleteFx({
					database: c.get("database"),
					text,
					lang,
				});

				const response = c.json<LocationSchema.Type[], 200 | 201>(
					result.data,
					result.status,
				);

				// Set headers
				Object.entries(result.headers).forEach(([key, value]) => {
					if (value !== undefined) {
						c.header(key, value);
					}
				});

				return response;
			}).pipe(
				Effect.catchAll((e) => {
					/**
					 * This just holds type exhaustive match for errors if any comes up.
					 */
					Match.value(e).pipe(Match.exhaustive);

					return Effect.succeed(
						c.json<MessageSchema.Type, 500>(
							{
								type: "error",
								message: "This should not happen",
							},
							500,
						),
					);
				}),
				Effect.runPromise,
			);
		},
	);
};
