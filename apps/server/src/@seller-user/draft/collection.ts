import { createRoute } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { draftCollectionFx } from "~/@seller-user/draft/fx/draftCollectionFx";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { DraftItemSchema } from "~/@seller-user/draft/schema/DraftItemSchema";
import { DraftQuerySchema } from "~/@seller-user/draft/schema/DraftQuerySchema";
import { KyselyContextLayer } from "~/database/context/KyselyContextLayer";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { withCollectionSchema } from "~/schema/withCollectionSchema";

const CollectionSchema = withCollectionSchema({
	schema: DraftItemSchema,
	type: "DraftItemSchema",
	description: "Collection of drafts",
});

export const withCollectionApiFx = Effect.fn("withCollectionApiFx")(function* () {
	const { sellerUserHono } = yield* RoutesContextFx;

	sellerUserHono.openapi(
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
				"Draft",
			],
			summary: "Fetch a collection of drafts based on the provided query",
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = c.get("user");

				return c.json<withCollectionSchema.Type<DraftItemSchema>, 200>(
					yield* zodFx({
						schema: CollectionSchema,
						dataFx: draftCollectionFx({
							...c.req.valid("json"),
							scope: {
								userId: user.id,
							},
						}) satisfies Effect.Effect<
							withCollectionSchema.Type<DraftItemSchema>,
							any,
							any
						>,
					}),
					200,
				);
			}).pipe(
				Effect.provide(KyselyContextLayer(c.get("kysely"))),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{ _tag: "ZodErrorFx" },
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
});
