import { createRoute } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { flagCollectionFx } from "~/@buyer-user/flag/fx/flagCollectionFx";
import { FlagItemSchema } from "~/@buyer-user/flag/schema/FlagItemSchema";
import { FlagQuerySchema } from "~/@buyer-user/flag/schema/FlagQuerySchema";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { withCollectionSchema } from "~/schema/withCollectionSchema";

const CollectionSchema = withCollectionSchema({
	schema: FlagItemSchema,
	type: "FlagItemSchema",
	description: "Collection of flag items",
});

export const withCollectionApiFx = Effect.fn("withCollectionApiFx")(function* () {
	const { buyerUserHono } = yield* RoutesContextFx;
	buyerUserHono.openapi(
		createRoute({
			method: "post",
			path: "/flag/collection",
			description: "Returns flag items based on provided parameters",
			operationId: "apiFlagCollection",
			request: {
				body: {
					content: {
						"application/json": {
							schema: FlagQuerySchema,
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
					description: "Access collection of flag items based on provided query",
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
				"Flag",
			],
			summary: "Fetch a collection of flag items based on the provided query",
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = c.get("user");

				return c.json<withCollectionSchema.Type<FlagItemSchema>, 200>(
					yield* zodFx({
						schema: CollectionSchema,
						dataFx: flagCollectionFx({
							...c.req.valid("json"),
							scope: {
								userId: user.id,
							},
						}) satisfies Effect.Effect<
							withCollectionSchema.Type<FlagItemSchema>,
							any,
							any
						>,
					}),
					200,
				);
			}).pipe(
				withKyselyFx(c.get("kysely")),
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
				Effect.runPromise,
			);
		},
	);
});
