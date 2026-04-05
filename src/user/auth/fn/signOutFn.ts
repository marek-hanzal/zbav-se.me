import { createServerFn } from "@tanstack/react-start";
import { withAuthMiddleware } from "~/server/middleware/withAuthMiddleware";

export const signOutFn = createServerFn()
	.middleware([
		withAuthMiddleware,
	])
	.handler(async ({ context: { auth } }) => {
		return auth.api.signOut();
	});
