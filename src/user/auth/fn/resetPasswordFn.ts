import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { withAuthMiddleware } from "~/server/middleware/withAuthMiddleware";

export const resetPasswordFn = createServerFn()
	.middleware([
		withAuthMiddleware,
	])
	.inputValidator(
		z
			.looseObject({
				token: z.string().min(1),
				newPassword: z.string().min(8),
			})
			.strip(),
	)
	.handler(async ({ data, context: { auth } }) => {
		return auth.api.resetPassword({
			body: data,
		});
	});
