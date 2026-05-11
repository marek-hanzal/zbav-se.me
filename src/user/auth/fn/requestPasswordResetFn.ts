import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { withAuthMiddleware } from "~/server/middleware/withAuthMiddleware";

export const requestPasswordResetFn = createServerFn()
	.middleware([
		withAuthMiddleware,
	])
	.inputValidator(
		z
			.looseObject({
				email: z.email(),
				redirectTo: z.url(),
			})
			.strip(),
	)
	.handler(async ({ data, context: { auth } }) => {
		return auth.api.requestPasswordReset({
			body: data,
		});
	});
