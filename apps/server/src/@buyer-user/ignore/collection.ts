import { createRoute } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { ignoreCollectionFx } from "~/@buyer-user/ignore/fx/ignoreCollectionFx";
import { IgnoreItemSchema } from "~/@buyer-user/ignore/schema/IgnoreItemSchema";
import { IgnoreQuerySchema } from "~/@buyer-user/ignore/schema/IgnoreQuerySchema";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { withCollectionSchema } from "~/schema/withCollectionSchema";

const CollectionSchema = withCollectionSchema({
	schema: IgnoreItemSchema,
	type: "IgnoreItemSchema",
	description: "Collection of ignore items",
});

export const withCollectionApiFx = Effect.fn("withCollectionApiFx")(function* () {
	const { buyerUserHono } = yield* RoutesContextFx;
	buyerUserHono.openapi(
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
				"Ignore",
			],
			summary: "Fetch a collection of ignore items based on the provided query",
		}),
		async (c) => {
			const axiomConfig = ServerAxiomSchema.parse(process.env);

			return Effect.gen(function* () {
				const user = c.get("user");

				yield* Effect.annotateLogsScoped({
					endpoint: "apiIgnoreCollection",
					userId: user.id,
				});

				const result = c.json<withCollectionSchema.Type<IgnoreItemSchema>, 200>(
					yield* zodFx({
						schema: CollectionSchema,
						dataFx: ignoreCollectionFx({
							...c.req.valid("json"),
							scope: {
								userId: user.id,
							},
						}) satisfies Effect.Effect<
							withCollectionSchema.Type<IgnoreItemSchema>,
							any,
							any
						>,
					}),
					200,
				);

				yield* Effect.log("apiIgnoreCollection");

				return result;
			}).pipe(
				withKyselyFx(c.get("kysely")),
				withLoggingFx(axiomConfig),
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
