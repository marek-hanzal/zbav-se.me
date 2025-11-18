import { createRoute } from "@hono/zod-openapi";
import { genId } from "@use-pico/common/gen-id";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { UserExPatchSchema } from "./schema/UserExPatchSchema";

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
			const json = c.req.valid("json");
			const { locationId, side } = json;

			try {
				await c.get("database").transaction().execute(async (trx) => {
					try {
						const userEx = await trx
							.selectFrom("user_ex")
							.where("userId", "=", c.get("user").id)
							.selectAll()
							.executeTakeFirstOrThrow();

						await trx
							.updateTable("user_ex")
							.set({
								...userEx,
								locationId,
								side,
							})
							.where("id", "=", userEx.id)
							.execute();
					} catch {
						await trx
							.insertInto("user_ex")
							.values({
								id: genId(),
								userId: c.get("user").id,
								locationId,
								side,
							})
							.execute();
					}
				});

				return c.body(null, 204);
			} catch (error) {
				console.error(error);
				return c.json<MessageSchema.Type, 500>(
					{
						type: "error",
						message: "Failed to update user extended information",
					},
					500,
				);
			}
		},
	);
};
