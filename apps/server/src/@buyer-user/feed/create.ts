import { createRoute } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { feedCreateFx } from "~/@buyer-user/feed/fx/feedCreateFx";
import { FeedCreateSchema } from "~/@buyer-user/feed/schema/FeedCreateSchema";
import { FeedSchema } from "~/@buyer-user/feed/schema/FeedSchema";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { withDateFx } from "~/database/fx/withDateFx";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withCreateApiFx = Effect.fn("withCreateApiFx")(function* () {
	const { buyerUserHono } = yield* RoutesContextFx;
	buyerUserHono.openapi(
		createRoute({
			method: "post",
			path: "/feed/create",
			description: "Create a new feed item",
			operationId: "apiFeedCreate",
			request: {
				body: {
					content: {
						"application/json": {
							schema: FeedCreateSchema,
						},
					},
					description: "Data for creating a new feed item",
				},
			},
			responses: {
				201: {
					content: {
						"application/json": {
							schema: FeedSchema,
						},
					},
					description: "The created feed item",
				},
				404: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Feed not found after creation",
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
			summary: "Create a new feed item",
		}),
		async (c) => {
			const axiomConfig = ServerAxiomSchema.parse(process.env);

			return Effect.gen(function* () {
				const user = c.get("user");

				yield* Effect.annotateLogsScoped({
					endpoint: "apiFeedCreate",
					userId: user.id,
				});

				const result = c.json<FeedSchema.Type, 201>(
					yield* zodFx({
						schema: FeedSchema,
						dataFx: feedCreateFx({
							...c.req.valid("json"),
							userId: user.id,
						}) satisfies Effect.Effect<FeedSchema.Type, any, any>,
					}),
					201,
				);

				yield* Effect.log("apiFeedCreate");

				return result;
			}).pipe(
				withKyselyFx(c.get("kysely")),
				withLoggingFx(axiomConfig),
				withDateFx,
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{
									_tag: "NotFoundErrorFx",
								},
								() => c.json(NotFoundNotice, 404),
							),
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
