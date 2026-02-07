import { createRoute } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { draftCreateFx } from "~/@seller-user/draft/fx/draftCreateFx";
import { DraftCreateSchema } from "~/@seller-user/draft/schema/DraftCreateSchema";
import { DraftSchema } from "~/@seller-user/draft/schema/DraftSchema";
import { withDateFx } from "~/database/fx/withDateFx";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withCreateApiFx = Effect.fn("withCreateApiFx")(function* () {
	const { sellerUserHono } = yield* RoutesContextFx;

	sellerUserHono.openapi(
		createRoute({
			method: "post",
			path: "/draft/create",
			description: "Create a new draft",
			operationId: "apiDraftCreate",
			request: {
				body: {
					content: {
						"application/json": {
							schema: DraftCreateSchema,
						},
					},
					description: "Data for creating a new draft",
				},
			},
			responses: {
				201: {
					content: {
						"application/json": {
							schema: DraftSchema,
						},
					},
					description: "The created draft",
				},
				400: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Invalid request",
				},
				404: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Draft not found after creation",
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
			summary: "Create a new draft",
		}),
		async (c) => {
			const axiomConfig = ServerAxiomSchema.parse(process.env);

			return Effect.gen(function* () {
				const user = c.get("user");

				yield* Effect.annotateLogsScoped({
					endpoint: "apiDraftCreate",
					userId: user.id,
				});

				const result = c.json<DraftSchema.Type, 201>(
					yield* zodFx({
						schema: DraftSchema,
						dataFx: draftCreateFx({
							...c.req.valid("json"),
							userId: user.id,
						}) satisfies Effect.Effect<DraftSchema.Type, any, any>,
					}),
					201,
				);

				yield* Effect.log("apiDraftCreate");

				return result;
			}).pipe(
				withLoggingFx(axiomConfig),
				withKyselyFx(c.get("kysely")),
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
