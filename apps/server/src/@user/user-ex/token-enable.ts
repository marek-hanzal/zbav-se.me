import { createRoute } from "@hono/zod-openapi";
import { Effect } from "effect";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { noticeError } from "~/@common/notice/noticeError";
import { userExTokenEnableFx } from "~/@user/user-ex/fx/userExTokenEnableFx";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withTokenEnableApiFx = Effect.fn("withTokenEnableApiFx")(function* () {
	const { userHono } = yield* RoutesContextFx;

	userHono.openapi(
		createRoute({
			method: "post",
			path: "/token/enable",
			description: "Generate and enable user bearer token",
			operationId: "apiUserTokenEnable",
			responses: {
				204: {
					description: "User token generated successfully, no content",
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
			summary: "Enable user token",
		}),
		async (c) => {
			const axiomConfig = ServerAxiomSchema.parse(process.env);

			return Effect.gen(function* () {
				const user = c.get("user");

				yield* Effect.annotateLogsScoped({
					endpoint: "apiUserTokenEnable",
					userId: user.id,
				});

				yield* userExTokenEnableFx({
					userId: user.id,
				});

				return c.body(null, 204);
			}).pipe(
				withKyselyFx(c.get("kysely")),
				withLoggingFx(axiomConfig, "apiUserTokenEnable"),
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
