import { createRoute } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { locationFetchFx } from "~/@session/location/fx/locationFetchFx";
import { LocationQuerySchema } from "~/@session/location/schema/LocationQuerySchema";
import { LocationSchema } from "~/@session/location/schema/LocationSchema";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withLocationFetchApiFx = Effect.fn("withLocationFetchApiFx")(function* () {
	const { sessionHono } = yield* RoutesContextFx;

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
							schema: NoticeSchema,
						},
					},
					description: "Location not found",
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
			summary: "Fetch a location based on the provided query",
		}),
		async (c) => {
			const axiomConfig = ServerAxiomSchema.parse(process.env);

			return Effect.gen(function* () {
				const user = c.get("user");

				yield* Effect.annotateLogsScoped({
					endpoint: "apiLocationFetch",
					userId: user.id,
				});

				const result = c.json<LocationSchema.Type, 200>(
					yield* zodFx({
						schema: LocationSchema,
						dataFx: locationFetchFx({
							...c.req.valid("json"),
						}) satisfies Effect.Effect<LocationSchema.Type, any, any>,
					}),
					200,
				);

				yield* Effect.log("apiLocationFetch");

				return result;
			}).pipe(
				withLoggingFx(axiomConfig),
				withKyselyFx(c.get("kysely")),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{
									_tag: "NotFoundErrorFx",
								},
								() => {
									return c.json(NotFoundNotice, 404);
								},
							),
							Match.when(
								{
									_tag: "ZodErrorFx",
								},
								({ zod }) => {
									return c.json(noticeZodError(zod), 500);
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
});
