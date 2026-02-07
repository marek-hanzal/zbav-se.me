import { createRoute } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Logger, LogLevel, Match } from "effect";
import { feedCollectionFx } from "~/@buyer-user/feed/fx/feedCollectionFx";
import { FeedItemSchema } from "~/@buyer-user/feed/schema/FeedItemSchema";
import { FeedQuerySchema } from "~/@buyer-user/feed/schema/FeedQuerySchema";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { KyselyContextLayer } from "~/database/context/KyselyContextLayer";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { withCollectionSchema } from "~/schema/withCollectionSchema";

const CollectionSchema = withCollectionSchema({
	schema: FeedItemSchema,
	type: "FeedItemSchema",
	description: "Collection of feed items",
});

export const withCollectionApiFx = Effect.fn("withCollectionApiFx")(function* () {
	const { buyerUserHono } = yield* RoutesContextFx;
	buyerUserHono.openapi(
		createRoute({
			method: "post",
			path: "/feed/collection",
			description: "Returns feed items based on provided parameters",
			operationId: "apiFeedCollection",
			request: {
				body: {
					content: {
						"application/json": {
							schema: FeedQuerySchema,
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
					description: "Access collection of feed items based on provided query",
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
				"Feed",
			],
			summary: "Fetch a collection of feed items based on the provided query",
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = c.get("user");

				const result = c.json<withCollectionSchema.Type<FeedItemSchema>, 200>(
					yield* zodFx({
						schema: CollectionSchema,
						dataFx: feedCollectionFx({
							...c.req.valid("json"),
							scope: {
								userId: user.id,
							},
						}) satisfies Effect.Effect<
							withCollectionSchema.Type<FeedItemSchema>,
							any,
							any
						>,
					}),
					200,
				);

				yield* Effect.log("apiFeedCollection");

				return result;
			}).pipe(
				Effect.provide(KyselyContextLayer(c.get("kysely"))),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
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
				//
				Effect.scoped,
				Effect.withLogSpan("runtime"),
				Effect.provide(Logger.json),
				Logger.withMinimumLogLevel(LogLevel.Info),
				//
				Effect.runPromise,
			);
		},
	);
});
