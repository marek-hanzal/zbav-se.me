import { createRoute, z } from "@hono/zod-openapi";
import { Effect } from "effect";
import { CategorySchema } from "~/@session/category/schema/CategorySchema";
import { LocationSchema } from "~/@session/location/schema/LocationSchema";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withSchemaEndpointFx = Effect.fn("withSchemaEndpointFx")(function* () {
	const { publicHono } = yield* RoutesContextFx;

	publicHono.openapi(
		createRoute({
			method: "get",
			path: "/schema",
			description:
				"Exposes schemas in OpenAPI/SDK. When called, always returns 400. Do not use as a real endpoint.",
			operationId: "apiPublicSchema",
			responses: {
				200: {
					content: {
						"application/json": {
							schema: z
								.tuple([
									CategorySchema,
									LocationSchema,
								])
								.optional()
								.openapi({
									description:
										"Not returned; for OpenAPI schema registration only.",
								}),
						},
					},
					description: "Not used; endpoint returns 400.",
				},
				400: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Bad request – this endpoint is for schema exposure only.",
				},
			},
			security: [],
			tags: [
				"Schema",
			],
		}),
		(c) =>
			c.json(
				{
					type: "error",
					message: "This endpoint is for OpenAPI schema exposure only. Do not call it.",
				} as NoticeSchema.Type,
				400,
			),
	);
});
