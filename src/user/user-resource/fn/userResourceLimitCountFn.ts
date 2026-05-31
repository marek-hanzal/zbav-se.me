import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { CountSchema } from "@/lib/common/schema";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { userResourceLimitCountFx } from "~/user/user-resource/server/fx/userResourceLimitCountFx";
import { UserResourceLimitCountQuerySchema } from "~/user/user-resource/server/schema/UserResourceLimitCountQuerySchema";

export namespace userResourceLimitCountFn {
	export type Error = Effect.Effect.Error<userResourceLimitCountFx>;
}

export const userResourceLimitCountFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(UserResourceLimitCountQuerySchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: CountSchema,
			dataFx: userResourceLimitCountFx({
				...data,
				scope: {
					userId: user.id,
				},
			}),
		}).pipe(
			withKyselyFx(database),
			withDateFx,
			withLoggerFx(rootLogger),
			Effect.tapError((error) =>
				Effect.sync(() => {
					logger.error(error._tag, {
						error,
					});
				}),
			),
			Effect.runPromise,
		);
	});
