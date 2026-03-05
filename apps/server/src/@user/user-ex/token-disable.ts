import { createRoute } from "@hono/zod-openapi";
import { Effect } from "effect";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { noticeError } from "~/@common/notice/noticeError";
import { userExTokenDisableFx } from "~/@user/user-ex/fx/userExTokenDisableFx";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withTokenDisableApiFx = Effect.fn("withTokenDisableApiFx")(function* () {
	const { userHono } = yield* RoutesContextFx;

	userHono.openapi(
		createRoute({
			method: "post",
			path: "/token/disable",
			description: "Disable user bearer token",
			operationId: "apiUserTokenDisable",
			responses: {
				204: {
					description: "User token disabled successfully, no content",
				},
				409: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Conflict (e.g. duplicate)",
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
				"User Ex",
			],
			summary: "Disable user token",
		}),
		async (c) => {
			const axiomConfig = ServerAxiomSchema.parse(process.env);

			return Effect.gen(function* () {
				const user = c.get("user");

				yield* Effect.annotateLogsScoped({
					endpoint: "apiUserTokenDisable",
					userId: user.id,
				});

				yield* userExTokenDisableFx({
					userId: user.id,
				});

				return c.body(null, 204);
			}).pipe(
				withKyselyFx(c.get("kysely")),
				withLoggingFx(axiomConfig, "apiUserTokenDisable"),
				withCatchFx({
					RuntimeErrorFx(e) {
						return c.json(noticeError(e), 500);
					},
					ConflictErrorFx(e) {
						return c.json(noticeError(e), 409);
					},
				}),
				Effect.runPromise,
			);
		},
	);
});
