import { createRoute, z } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { LocationContextLayer } from "~/@session/location/context/LocationContextLayer";
import { locationAutocompleteFx } from "~/@session/location/fx/locationAutocompleteFx";
import { LocationAutocompleteSchema } from "~/@session/location/schema/LocationAutocompleteSchema";
import { LocationSchema } from "~/@session/location/schema/LocationSchema";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerGeoapifySchema } from "~/schema/env/ServerGeoapifySchema";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withLocationAutocompleteApiFx = Effect.fn("withLocationAutocompleteApiFx")(
	function* () {
		const { sessionHono } = yield* RoutesContextFx;

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
					"Location",
				],
				summary: "Return a location autocomplete",
			}),
			async (c) => {
				const geoapifyConfig = ServerGeoapifySchema.parse(process.env);

				return Effect.gen(function* () {
					return c.json<LocationSchema.Type[], 200>(
						yield* zodFx({
							schema: z.array(LocationSchema),
							dataFx: locationAutocompleteFx({
								...c.req.valid("json"),
							}) satisfies Effect.Effect<LocationSchema.Type[], any, any>,
						}),
						200,
					);
				}).pipe(
					withKyselyFx(c.get("kysely")),
					Effect.provide(
						LocationContextLayer({
							geoapifyToken: geoapifyConfig.SERVER_GEOAPIFY_TOKEN,
							api: "https://api.geoapify.com",
							autocomplete: "/v1/geocode/autocomplete",
						}),
					),
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
									({ zod }) => c.json(noticeZodError(zod), 500),
								),
								Match.exhaustive,
							),
						);
					}),
					Effect.runPromise,
				);
			},
		);
	},
);
