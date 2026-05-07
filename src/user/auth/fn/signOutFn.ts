import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { withAuthMiddleware } from "~/server/middleware/withAuthMiddleware";

export const signOutFn = createServerFn()
	.middleware([
		withAuthMiddleware,
	])
	.handler(async ({ context: { auth } }) => {
		return auth.api.signOut({
			headers: getRequestHeaders(),
		});
	});
