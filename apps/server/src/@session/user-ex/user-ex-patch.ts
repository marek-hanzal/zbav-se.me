import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { UserExPatchSchema } from "./schema/UserExPatchSchema";
import { userExPatchFx } from "./service/userExPatchFx";

export const withUserExPatchApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
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
				204: {
					description: "User extended information updated successfully",
				},
				500: {
					content: {
						"application/json": {
							schema: MessageSchema,
						},
					},
					description: "Internal server error",
				},
			},
			tags: [
				"user-ex",
				"session",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				yield* userExPatchFx({
					database: c.get("database"),
					userId: c.get("user").id,
					data: c.req.valid("json"),
				});

				return c.body(null, 204);
			}).pipe(
				Effect.catchAll((e) => {
					/**
					 * This just holds type exhaustive match for errors if any comes up.
					 */
					Match.value(e).pipe(Match.exhaustive);

					return Effect.succeed(
						c.json<MessageSchema.Type, 500>(
							{
								type: "error",
								message: "Failed to update user extended information",
							},
							500,
						),
					);
				}),
				Effect.runPromise,
			);
		},
	);
};
