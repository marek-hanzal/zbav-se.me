import { createRoute } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { draftCountFx } from "~/@seller-user/draft/fx/draftCountFx";
import { DraftCountQuerySchema } from "~/@seller-user/draft/schema/DraftCountQuerySchema";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { CountSchema } from "~/schema/CountSchema";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withCountApiFx = Effect.fn("withCountApiFx")(function* () {
	const { sellerUserHono } = yield* RoutesContextFx;

	sellerUserHono.openapi(
		createRoute({
			method: "post",
			path: "/draft/count",
			description: "Returns count of drafts based on provided query",
			operationId: "apiDraftCount",
			request: {
				body: {
					content: {
						"application/json": {
							schema: DraftCountQuerySchema,
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
				"Draft",
			],
			summary: "Count drafts based on the provided query",
		}),
		async (c) => {
			const axiomConfig = ServerAxiomSchema.parse(process.env);

			return Effect.gen(function* () {
				const user = c.get("user");

				yield* Effect.annotateLogsScoped({
					endpoint: "apiDraftCount",
					userId: user.id,
				});

				const result = c.json<CountSchema.Type, 200>(
					yield* zodFx({
						schema: CountSchema,
						dataFx: draftCountFx({
							...c.req.valid("json"),
							scope: {
								userId: user.id,
							},
						}) satisfies Effect.Effect<CountSchema.Type, any, any>,
					}),
					200,
				);

				yield* Effect.log("apiDraftCount");

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
