import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import z from "zod";
import { genId } from "@/lib/common/gen-id";
import { withLoggerFx } from "@/lib/common/log";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withAuthMiddleware } from "~/server/middleware/withAuthMiddleware";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withRequestSourceMiddleware } from "~/server/middleware/withRequestSourceMiddleware";
import { rateLimitCheckFx } from "~/server/rate-limit/server/fx/rateLimitCheckFx";

export const signUpFn = createServerFn()
	.middleware([
		withAuthMiddleware,
		withDatabaseMiddleware,
		withLogMiddleware,
		withRequestSourceMiddleware,
	])
	.inputValidator(
		z
			.looseObject({
				email: z.email(),
				password: z.string(),
			})
			.strip(),
	)
	.handler(async ({ data, context: { auth, database, rootLogger, requestSource } }) => {
		await rateLimitCheckFx({
			key: [
				requestSource,
			],
			rule: "sign-up",
			message: "Too many requests from the single IP, sorry",
		}).pipe(withKyselyFx(database), withLoggerFx(rootLogger), withDateFx, Effect.runPromise);

		return auth.api.signUpEmail({
			body: {
				...data,
				name: genId(),
			},
		});
	});
