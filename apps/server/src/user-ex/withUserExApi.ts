import { createRoute } from "@hono/zod-openapi";
import { genId } from "@use-pico/common";
import { database } from "../database/kysely";
import type { Routes } from "../hono/Routes";
import { withSessionHono } from "../hono/withSessionHono";
import { ErrorSchema } from "../schema/ErrorSchema";
import { UserPatchSchema } from "./schema/UserPatchSchema";

export const withUserExApi = ({ session }: Routes) => {
	const hono = withSessionHono();

	hono.openapi(
		createRoute({
			method: "patch",
			path: "/user-ex",
			description: "Update user extended information",
			operationId: "apiUserExPatch",
			request: {
				body: {
					content: {
						"application/json": {
							schema: UserPatchSchema,
						},
					},
					description: "User extended information to update",
				},
			},
			responses: {
				200: {
					description:
						"User extended information updated successfully",
				},
				500: {
					content: {
						"application/json": {
							schema: ErrorSchema,
						},
					},
					description: "Internal server error",
				},
			},
			tags: [
				"user-ex",
			],
		}),
		async (c) => {
			const json = c.req.valid("json");
			const { locationId, side } = json;

			try {
				await database.kysely.transaction().execute(async (trx) => {
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

				return c.body(null, 200);
			} catch (error) {
				console.error(error);
				return c.json(
					{
						message: "Internal server error",
					},
					500,
				);
			}
		},
	);

	session.route("/", hono);
};
