import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { withAuthMiddleware } from "~/request-middleware/middleware/withAuthMiddleware";

export const getSessionFn = createServerFn()
	.middleware([
		withAuthMiddleware,
	])
	.handler(async ({ context: { auth } }) => {
		return auth.api.getSession({
			headers: getRequestHeaders(),
		});
	});
