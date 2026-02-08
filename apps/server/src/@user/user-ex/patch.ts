import { createRoute } from "@hono/zod-openapi";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { userExPatchFx } from "~/@user/user-ex/fx/userExPatchFx";
import { UserExPatchSchema } from "~/@user/user-ex/schema/UserExPatchSchema";
import { UserExSchema } from "~/@user/user-ex/schema/UserExSchema";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withPatchApiFx = Effect.fn("withPatchApiFx")(function* () {
	const { userHono } = yield* RoutesContextFx;

	userHono.openapi(
		createRoute({
			method: "patch",
			path: "/user-ex",
			description: "Update user extended information",
			operationId: "apiUserExPatch",
			request: {
				body: {
					content: {
						"application/json": {
							schema: UserExPatchSchema,
						},
					},
					description: "User extended information to update",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: UserExSchema,
						},
					},
					description: "User extended information updated successfully",
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
			summary: "Update user extended information",
		}),
		async (c) => {
			const axiomConfig = ServerAxiomSchema.parse(process.env);

			return Effect.gen(function* () {
				const user = c.get("user");

				yield* Effect.annotateLogsScoped({
					endpoint: "apiUserExPatch",
					userId: user.id,
				});

				return c.json(
					yield* zodGuardFx({
						schema: UserExSchema,
						dataFx: userExPatchFx({
							...c.req.valid("json"),
							userId: user.id,
						}),
					}),
					200,
				);
			}).pipe(
				Effect.tap(() => Effect.log("apiUserExPatch")),
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
