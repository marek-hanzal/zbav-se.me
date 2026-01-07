import { createRoute, z } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { AppEnv } from "~/AppEnv";
import { LocationContextProvider } from "~/app/location/context/LocationContextFx";
import { locationAutocompleteFx } from "~/app/location/fx/locationAutocompleteFx";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { LocationAutocompleteSchema } from "./schema/LocationAutocompleteSchema";
import { LocationSchema } from "./schema/LocationSchema";

export const withLocationAutocompleteApi: Routes.Fn = async ({ sessionHono }) => {
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
					description: "Locations, include empty array if no locations found",
				},
				500: {
					content: {
						"application/json": {
							schema: NoticeSchema,
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
					yield* zodFx({
						schema: z.array(LocationSchema),
						dataFx: locationAutocompleteFx({
							...c.req.valid("json"),
						}),
					}),
					200,
				);
			}).pipe(
				DatabaseContextProvider(c.get("database")),
				LocationContextProvider({
					geoapifyToken: AppEnv.SERVER_GEOAPIFY_TOKEN,
					api: "https://api.geoapify.com",
					autocomplete: "/v1/geocode/autocomplete",
				}),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{
									_tag: "TextTooShortErrorFx",
								},
								() => {
									return c.json<LocationSchema.Type[], 200>([], 200, {
										/**
										 * Keep responding, just mark header so more clever guys can eventually see,
										 * what's wrong.
										 */
										"X-Location-Error": "Text too short",
									});
								},
							),
							Match.when(
								{
									_tag: "ZodErrorFx",
								},
								() => {
									return c.json<NoticeSchema.Type, 500>(
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
