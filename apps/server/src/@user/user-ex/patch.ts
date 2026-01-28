import { createRoute, z } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { userExPatchFx } from "~/@user/user-ex/fx/userExPatchFx";
import { UserExPatchSchema } from "~/@user/user-ex/schema/UserExPatchSchema";
import { KyselyContextLayer } from "~/database/context/KyselyContextLayer";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { UserExSchema } from "./schema/UserExSchema";

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
		async (c) =>
			Effect.gen(function* () {
				const user = c.get("user");

				return c.json<UserExSchema.Type, 200>(
					yield* zodFx({
						schema: UserExSchema,
						dataFx: userExPatchFx({
							...c.req.valid("json"),
							userId: user.id,
						}) satisfies Effect.Effect<UserExSchema.Type, any, any>,
					}),
					200,
				);
			}).pipe(
				Effect.provide(KyselyContextLayer(c.get("kysely"))),
				//
				Effect.catchAll((e) =>
					Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{
									_tag: "ZodErrorFx",
								},
								({ zod }) =>
									c.json<NoticeSchema.Type, 500>(
										{
											type: "error",
											message: z.prettifyError(zod),
										},
										500,
									),
							),
							Match.exhaustive,
						),
					),
				),
				Effect.runPromise,
			),
	);
});
