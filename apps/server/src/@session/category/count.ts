import { createRoute } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { categoryCountFx } from "~/@session/category/fx/categoryCountFx";
import { CategoryCountQuerySchema } from "~/@session/category/schema/CategoryCountQuerySchema";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { CountSchema } from "~/schema/CountSchema";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withCategoryCountApiFx = Effect.fn("withCategoryCountApiFx")(function* () {
	const { sessionHono } = yield* RoutesContextFx;

	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/category/count",
			description: "Returns count of categories based on provided query",
			operationId: "apiCategoryCount",
			request: {
				body: {
					content: {
						"application/json": {
							schema: CategoryCountQuerySchema,
						},
					},
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: CountSchema,
						},
					},
					description: "Return counts based on provided query",
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
				"Category",
			],
			summary: "Count categories based on the provided query",
		}),
		async (c) => {
			const axiomConfig = ServerAxiomSchema.parse(process.env);

			return Effect.gen(function* () {
				const user = c.get("user");

				yield* Effect.annotateLogsScoped({
					endpoint: "apiCategoryCount",
					userId: user.id,
				});

				const result = c.json<CountSchema.Type, 200>(
					yield* zodFx({
						schema: CountSchema,
						dataFx: categoryCountFx({
							...c.req.valid("json"),
							scope: {},
						}) satisfies Effect.Effect<CountSchema.Type, any, any>,
					}),
					200,
				);

				yield* Effect.log("apiCategoryCount");

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
