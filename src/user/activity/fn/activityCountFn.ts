import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { CountSchema } from "@/lib/common/schema";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { activityCountFx } from "~/user/activity/server/fx/activityCountFx";
import { ActivityCountQuerySchema } from "~/user/activity/server/schema/ActivityCountQuerySchema";

export const activityCountFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(ActivityCountQuerySchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: CountSchema,
			dataFx: activityCountFx({
				...data,
				scope: {
					userId: user.id,
				},
			}),
		}).pipe(
			withKyselyFx(database),
			withLoggerFx(rootLogger),
			withCatchFx({
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
