import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { userExTokenEnableFx } from "~/user/user-ex/server/fx/userExTokenEnableFx";
import { UserExSchema } from "~/user/user-ex/server/schema/UserExSchema";

export const userExTokenEnableFn = createServerFn({
	method: "POST",
})
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.handler(async ({ context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.debug(name);

		return zodGuardFx({
			schema: UserExSchema,
			dataFx: userExTokenEnableFx({
				userId: user.id,
			}),
		}).pipe(
			withKyselyFx(database),
			withLoggerFx(rootLogger),
			withCatchFx({
				ConflictErrorFx(error) {
					logger.error("ConflictError", {
						message: error.message,
					});
					throw new Error("ConflictError");
				},
				RuntimeErrorFx(error) {
					logger.error("RuntimeError", {
						message: error.message,
						cause: error.cause,
					});
					throw new Error("RuntimeError");
				},
				ZodErrorFx({ zod, input }) {
					logger.error("ZodError", {
						zod,
						input,
					});
					throw new Error("ZodError");
				},
			}),
			Effect.runPromise,
		);
	});
