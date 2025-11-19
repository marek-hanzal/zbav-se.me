import { createRoute, z } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { DatabaseContextProvider } from "../../fx/DatabaseContextFx";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { locationAutocompleteFx } from "./fx/locationAutocompleteFx";
import { LocationAutocompleteSchema } from "./schema/LocationAutocompleteSchema";
import { LocationSchema } from "./schema/LocationSchema";

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
				400: {
					content: {
						"application/json": {
							schema: MessageSchema,
						},
					},
					description: "Text too short",
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
			return Effect.gen(function* () {
				return c.json<LocationSchema.Type[], 200>(
					yield* locationAutocompleteFx(c.req.valid("json")),
					200,
				);
			}).pipe(
				DatabaseContextProvider(c.get("database")),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{
									_tag: "TextTooShortError",
								},
								() => {
									return c.json<MessageSchema.Type, 400>(
										{
											type: "error",
											message: e.message,
										},
										400,
									);
								},
							),
							Match.when(
								{
									_tag: "UnknownException",
								},
								() => {
									return c.json<MessageSchema.Type, 500>(
										{
											type: "error",
											message: e.message,
										},
										500,
									);
								},
							),
							Match.exhaustive,
						),
					);
				}),
				Effect.runPromise,
			);
		},
	);
};
