import { createRoute } from "@hono/zod-openapi";
import { Effect } from "effect";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { noticeError } from "~/@common/notice/noticeError";
import { inboxArchiveFx } from "~/@user/inbox/fx/inboxArchiveFx";
import { InboxQuerySchema } from "~/@user/inbox/schema/InboxQuerySchema";
import { withDateFx } from "~/database/fx/withDateFx";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withArchiveApiFx = Effect.fn("withArchiveApiFx")(function* () {
	const { userHono } = yield* RoutesContextFx;

	userHono.openapi(
		createRoute({
			method: "post",
			path: "/inbox/archive",
			description: "Archive inbox items matched by query",
			operationId: "apiInboxArchive",
			request: {
				body: {
					content: {
						"application/json": {
							schema: InboxQuerySchema,
						},
					},
					description: "Inbox query used for bulk archive",
				},
			},
			responses: {
				204: {
					description: "Archived, no content",
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
				"Inbox",
			],
			summary: "Archive selected inbox items",
		}),
		async (c) => {
			const axiomConfig = ServerAxiomSchema.parse(process.env);

			return Effect.gen(function* () {
				const user = c.get("user");

				yield* Effect.annotateLogsScoped({
					endpoint: "apiInboxArchive",
					userId: user.id,
				});

				yield* inboxArchiveFx({
					...c.req.valid("json"),
					scope: {
						userId: user.id,
					},
				});

				return c.body(null, 204);
			}).pipe(
				withKyselyFx(c.get("kysely")),
				withLoggingFx(axiomConfig, "apiInboxArchive", c.get("traceId")),
				withDateFx,
				withCatchFx({
					RuntimeErrorFx(e) {
						return c.json(noticeError(e), 500);
					},
				}),
				Effect.runPromise,
			);
		},
	);
});
