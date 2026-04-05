import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { withAuthMiddleware } from "~/server/middleware/withAuthMiddleware";

export const getSessionFn = createServerFn()
	.middleware([
		withAuthMiddleware,
	])
	.handler(async ({ context: { auth } }) => {
		const session = await auth.api.getSession({
			headers: getRequestHeaders(),
		});

		console.log("session!", {
			headers: getRequestHeaders(),
			session,
		});

		return session;
	});
