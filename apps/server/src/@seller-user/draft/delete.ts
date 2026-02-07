import { createRoute } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { draftDeleteFx } from "~/@seller-user/draft/fx/draftDeleteFx";
import { DraftQuerySchema } from "~/@seller-user/draft/schema/DraftQuerySchema";
import { DraftSchema } from "~/@seller-user/draft/schema/DraftSchema";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withDeleteApiFx = Effect.fn("withDeleteApiFx")(function* () {
	const { sellerUserHono } = yield* RoutesContextFx;

	sellerUserHono.openapi(
		createRoute({
			method: "delete",
			path: "/draft/delete",
			description: "Delete a draft based on the provided query (user-specific)",
			operationId: "apiDraftDelete",
			request: {
				body: {
					content: {
						"application/json": {
							schema: DraftQuerySchema,
						},
					},
					description: "Query object for draft deletion",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: DraftSchema,
						},
					},
					description: "The deleted draft",
				},
				404: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Draft not found",
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
			summary: "Delete a draft based on the provided query",
		}),
		async (c) => {
			const axiomConfig = ServerAxiomSchema.parse(process.env);

			return Effect.gen(function* () {
				const user = c.get("user");

				yield* Effect.annotateLogsScoped({
					endpoint: "apiDraftDelete",
					userId: user.id,
				});

				const result = c.json<DraftSchema.Type, 200>(
					yield* zodFx({
						schema: DraftSchema,
						dataFx: draftDeleteFx({
							...c.req.valid("json"),
							scope: {
								userId: user.id,
							},
						}) satisfies Effect.Effect<DraftSchema.Type, any, any>,
					}),
					200,
				);

				yield* Effect.log("apiDraftDelete");

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
									_tag: "NotFoundErrorFx",
								},
								() => {
									return c.json(NotFoundNotice, 404);
								},
							),
							Match.when(
								{
									_tag: "ZodErrorFx",
								},
								({ zod }) => {
									return c.json(noticeZodError(zod), 500);
								},
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
