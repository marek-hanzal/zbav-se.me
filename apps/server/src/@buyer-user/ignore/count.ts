import { createRoute } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { ignoreCountFx } from "~/@buyer-user/ignore/fx/ignoreCountFx";
import { IgnoreCountQuerySchema } from "~/@buyer-user/ignore/schema/IgnoreCountQuerySchema";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { CountSchema } from "~/schema/CountSchema";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withCountApiFx = Effect.fn("withCountApiFx")(function* () {
	const { buyerUserHono } = yield* RoutesContextFx;
	buyerUserHono.openapi(
		createRoute({
			method: "post",
			path: "/ignore/count",
			description: "Returns count of ignore items based on provided query",
			operationId: "apiIgnoreCount",
			request: {
				body: {
					content: {
						"application/json": {
							schema: IgnoreCountQuerySchema,
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
				"Ignore",
			],
			summary: "Count ignore items based on the provided query",
		}),
		async (c) => {
			const axiomConfig = ServerAxiomSchema.parse(process.env);

			return Effect.gen(function* () {
				const user = c.get("user");

				yield* Effect.annotateLogsScoped({
					endpoint: "apiIgnoreCount",
					userId: user.id,
				});

				const result = c.json<CountSchema.Type, 200>(
					yield* zodFx({
						schema: CountSchema,
						dataFx: ignoreCountFx({
							...c.req.valid("json"),
							scope: {
								userId: user.id,
							},
						}) satisfies Effect.Effect<CountSchema.Type, any, any>,
					}),
					200,
				);

				yield* Effect.log("apiIgnoreCount");

				return result;
			}).pipe(
				withKyselyFx(c.get("kysely")),
				withLoggingFx(axiomConfig),
				withCatchFx({
					ZodErrorFx({ zod }) {
						return c.json(noticeZodError(zod), 500);
					},
				}),
				Effect.runPromise,
			);
		},
	);
});
