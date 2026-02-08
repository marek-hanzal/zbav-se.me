import { createRoute, z } from "@hono/zod-openapi";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { locationAutocompleteFx } from "~/@session/location/fx/locationAutocompleteFx";
import { withLocationFx } from "~/@session/location/fx/withLocationFx";
import { LocationAutocompleteSchema } from "~/@session/location/schema/LocationAutocompleteSchema";
import { LocationSchema } from "~/@session/location/schema/LocationSchema";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";
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
				const axiomConfig = ServerAxiomSchema.parse(process.env);

				const geoapifyConfig = ServerGeoapifySchema.parse(process.env);

				return Effect.gen(function* () {
					const user = c.get("user");

					yield* Effect.annotateLogsScoped({
						endpoint: "apiLocationAutocomplete",
						userId: user.id,
					});

					return c.json(
						yield* zodGuardFx({
							schema: z.array(LocationSchema),
							dataFx: locationAutocompleteFx({
								...c.req.valid("json"),
							}),
						}),
						200,
					);
				}).pipe(
					withLoggingFx(axiomConfig, "apiLocationAutocomplete"),
					withKyselyFx(c.get("kysely")),
					withLocationFx({
						geoapifyToken: geoapifyConfig.SERVER_GEOAPIFY_TOKEN,
						api: "https://api.geoapify.com",
						autocomplete: "/v1/geocode/autocomplete",
					}),
					withCatchFx({
						TextTooShortErrorFx() {
							return c.json([], 200, {
								"X-Location-Error": "Text too short",
							});
						},
						ZodErrorFx({ zod }) {
							return c.json(noticeZodError(zod), 500);
						},
					}),
					Effect.runPromise,
				);
			},
		);
	},
);
