import { createRoute } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { feedFetchFx } from "~/@buyer-user/feed/fx/feedFetchFx";
import { FeedQuerySchema } from "~/@buyer-user/feed/schema/FeedQuerySchema";
import { FeedSchema } from "~/@buyer-user/feed/schema/FeedSchema";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withFetchApiFx = Effect.fn("withFetchApiFx")(function* () {
	const { buyerUserHono } = yield* RoutesContextFx;

	buyerUserHono.openapi(
		createRoute({
			method: "post",
			path: "/feed/fetch",
			description: "Return a feed item based on the provided query",
			operationId: "apiFeedFetch",
			request: {
				body: {
					content: {
						"application/json": {
							schema: FeedQuerySchema,
						},
					},
					description: "Query object for feed fetch",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: FeedSchema,
						},
					},
					description: "Return a feed item based on the provided query",
				},
				404: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Feed item not found",
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
			summary: "Fetch a feed item based on the provided query",
		}),
		async (c) => {
			const axiomConfig = ServerAxiomSchema.parse(process.env);

			return Effect.gen(function* () {
				const user = c.get("user");

				yield* Effect.annotateLogsScoped({
					endpoint: "apiFeedFetch",
					userId: user.id,
				});

				const result = c.json<FeedSchema.Type, 200>(
					yield* zodFx({
						schema: FeedSchema,
						dataFx: feedFetchFx({
							...c.req.valid("json"),
							scope: {
								userId: user.id,
							},
						}) satisfies Effect.Effect<FeedSchema.Type, any, any>,
					}),
					200,
				);

				yield* Effect.log("apiFeedFetch");

				return result;
			}).pipe(
				withKyselyFx(c.get("kysely")),
				withLoggingFx(axiomConfig),
				withCatchFx({
					NotFoundErrorFx() {
						return c.json(NotFoundNotice, 404);
					},
					ZodErrorFx({ zod }) {
						return c.json(noticeZodError(zod), 500);
					},
				}),
				Effect.runPromise,
			);
		},
	);
});
