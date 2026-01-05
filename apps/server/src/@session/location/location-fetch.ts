import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { locationFetchFx } from "./fx/locationFetchFx";
import { LocationQuerySchema } from "./schema/LocationQuerySchema";
import { LocationSchema } from "./schema/LocationSchema";

export const withLocationFetchApi: Routes.Fn = async ({ sessionHono }) => {
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
				"location",
				"session",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json<LocationSchema.Type, 200>(
					yield* locationFetchFx(c.req.valid("json")),
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
									_tag: "NotFoundErrorFx",
								},
								() => {
									return c.json<NoticeSchema.Type, 404>(
										{
											type: "error",
											message: e.message,
										},
										404,
									);
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
