import { createRoute } from "@hono/zod-openapi";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { noticeError } from "~/@common/notice/noticeError";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { userExTokenEnableFx } from "~/@user/user-ex/fx/userExTokenEnableFx";
import { UserExSchema } from "~/@user/user-ex/schema/UserExSchema";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
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
				200: {
					content: {
						"application/json": {
							schema: UserExSchema,
						},
					},
					description: "User token generated successfully",
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
				"User",
				"Token",
			],
			summary: "Enable user token",
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = c.get("user");

				return c.json(
					yield* zodGuardFx({
						schema: UserExSchema,
						dataFx: userExTokenEnableFx({
							userId: user.id,
						}),
					}),
					200,
				);
			}).pipe(
				withKyselyFx(c.get("kysely")),
				withCatchFx({
					RuntimeErrorFx(e) {
						return c.json(noticeError(e), 500);
					},
					ConflictErrorFx(e) {
						return c.json(noticeError(e), 409);
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
