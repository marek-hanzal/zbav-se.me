import { createRoute } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { ignoreCollectionFx } from "~/app/ignore/fx/ignoreCollectionFx";
import { IgnoreQuerySchema } from "~/app/ignore/schema/IgnoreQuerySchema";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import { RoutesContextFx } from "~/app/routes/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { withCollectionSchema } from "~/schema/withCollectionSchema";
import { IgnoreSchema } from "./schema/IgnoreSchema";

const CollectionSchema = withCollectionSchema({
	schema: IgnoreSchema,
	type: "IgnoreCollection",
	description: "Collection of ignore items",
});

export const withCollectionApiFx = Effect.fn("withCollectionApiFx")(function* () {
	const { userHono } = yield* RoutesContextFx;
	userHono.openapi(
		createRoute({
			method: "post",
			path: "/ignore/collection",
			description: "Returns ignore items based on provided parameters",
			operationId: "apiIgnoreCollection",
			request: {
				body: {
					content: {
						"application/json": {
							schema: IgnoreQuerySchema,
						},
					},
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: CollectionSchema,
						},
					},
					description: "Access collection of ignore items based on provided query",
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
				"ignore",
				"user",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = c.get("user");

				return c.json<withCollectionSchema.Type<IgnoreSchema>, 200>(
					yield* zodFx({
						schema: CollectionSchema,
						dataFx: ignoreCollectionFx({
							...c.req.valid("json"),
							scope: {
								userId: user.id,
							},
						}),
					}),
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
});
