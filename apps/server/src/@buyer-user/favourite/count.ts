import { createRoute } from "@hono/zod-openapi";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { favouriteCountFx } from "~/@buyer-user/favourite/fx/favouriteCountFx";
import { FavouriteCountQuerySchema } from "~/@buyer-user/favourite/schema/FavouriteCountQuerySchema";
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
			path: "/favourite/count",
			description: "Returns count of favourite items based on provided query",
			operationId: "apiFavouriteCount",
			request: {
				body: {
					content: {
						"application/json": {
							schema: FavouriteCountQuerySchema,
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
				"Favourite",
			],
			summary: "Count favourite items based on the provided query",
		}),
		async (c) => {
			const axiomConfig = ServerAxiomSchema.parse(process.env);

			return Effect.gen(function* () {
				const user = c.get("user");

				yield* Effect.annotateLogsScoped({
					endpoint: "apiFavouriteCount",
					userId: user.id,
				});

				return c.json(
					yield* zodGuardFx({
						schema: CountSchema,
						dataFx: favouriteCountFx({
							...c.req.valid("json"),
							scope: {
								userId: user.id,
							},
						}),
					}),
					200,
				);
			}).pipe(
				Effect.tap(() => Effect.log("apiFavouriteCount")),
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
