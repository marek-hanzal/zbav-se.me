import { createRoute } from "@hono/zod-openapi";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeError } from "~/@common/notice/noticeError";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { draftPatchFx } from "~/@seller/draft/fx/draftPatchFx";
import { DraftPatchSchema } from "~/@seller/draft/schema/DraftPatchSchema";
import { DraftSchema } from "~/@seller/draft/schema/DraftSchema";
import { withDateFx } from "~/database/fx/withDateFx";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withPatchApiFx = Effect.fn("withPatchApiFx")(function* () {
	const { sellerHono } = yield* RoutesContextFx;

	sellerHono.openapi(
		createRoute({
			method: "post",
			path: "/draft/patch",
			description: "Update an existing draft",
			operationId: "apiDraftPatch",
			request: {
				body: {
					content: {
						"application/json": {
							schema: DraftPatchSchema,
						},
					},
					description: "Data for updating an existing draft",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: DraftSchema,
						},
					},
					description: "The updated draft",
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
			summary: "Partial update of a draft",
		}),
		async (c) => {
			const axiomConfig = ServerAxiomSchema.parse(process.env);

			return Effect.gen(function* () {
				const user = c.get("user");

				yield* Effect.annotateLogsScoped({
					endpoint: "apiDraftPatch",
					userId: user.id,
				});

				return c.json(
					yield* zodGuardFx({
						schema: DraftSchema,
						dataFx: draftPatchFx({
							...c.req.valid("json"),
							scope: {
								userId: user.id,
							},
						}),
					}),
					200,
				);
			}).pipe(
				withKyselyFx(c.get("kysely")),
				withDateFx,
				withLoggingFx(axiomConfig, "apiDraftPatch"),
				withCatchFx({
					NotFoundErrorFx() {
						return c.json(NotFoundNotice, 404);
					},
					RuntimeErrorFx(e) {
						return c.json(noticeError(e), 500);
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
