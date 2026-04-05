import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { withAuthMiddleware } from "~/server/middleware/withAuthMiddleware";

export const signInFn = createServerFn()
	.middleware([
		withAuthMiddleware,
	])
	.inputValidator(
		z
			.looseObject({
				email: z.email(),
				password: z.string(),
			})
			.strip(),
	)
	.handler(async ({ data, context: { auth } }) => {
		return auth.api.signInEmail({
			body: data,
		});
	});
