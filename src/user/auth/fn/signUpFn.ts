import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { genId } from "@/lib/common/gen-id";
import { withAuthMiddleware } from "~/server/middleware/withAuthMiddleware";

export const signUpFn = createServerFn()
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
		return auth.api.signUpEmail({
			body: {
				...data,
				name: genId(),
			},
		});
	});
