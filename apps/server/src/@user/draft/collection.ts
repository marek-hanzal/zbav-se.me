import { createRoute } from "@hono/zod-openapi";
import { EntitySchema, zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { draftCollectionFx } from "~/app/draft/fx/draftCollectionFx";
import { DraftQuerySchema } from "~/app/draft/schema/DraftQuerySchema";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { withCollectionSchema } from "~/schema/withCollectionSchema";

const CollectionSchema = withCollectionSchema({
	schema: EntitySchema,
	type: "DraftCollection",
	description: "Collection of drafts",
});

export const withCollectionApi: Routes.Fn = async ({ userHono }) => {
	userHono.openapi(
		createRoute({
			method: "post",
			path: "/draft/collection",
			description: "Returns drafts based on provided parameters",
			operationId: "apiDraftCollection",
			request: {
				body: {
					content: {
						"application/json": {
							schema: DraftQuerySchema,
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
					description: "Access collection of drafts based on provided query",
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
				"draft",
				"user",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json<withCollectionSchema.Type<EntitySchema>, 200>(
					yield* zodFx({
						schema: CollectionSchema,
						dataFx: draftCollectionFx({
							...c.req.valid("json"),
							scope: {
								userId: c.get("user").id,
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
};
