import { createMiddleware } from "@tanstack/react-start";
import { auth } from "~/server/auth/auth";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";

let instance: ReturnType<typeof auth> | null = null;

export const withAuthMiddleware = createMiddleware()
	.middleware([
		withDatabaseMiddleware,
	])
	.server(async ({ next, context: { database } }) => {
		return next({
			context: {
				auth: (instance ??= auth(() => database.dialect)),
			},
		});
	});
