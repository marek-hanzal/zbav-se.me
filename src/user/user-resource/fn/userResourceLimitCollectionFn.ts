import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { z } from "zod";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { userResourceLimitCollectionFx } from "~/user/user-resource/server/fx/userResourceLimitCollectionFx";
import { UserResourceLimitQuerySchema } from "~/user/user-resource/server/schema/UserResourceLimitQuerySchema";
import { UserResourceLimitSchema } from "~/user/user-resource/server/schema/UserResourceLimitSchema";

export namespace userResourceLimitCollectionFn {
	export type Error = Effect.Effect.Error<userResourceLimitCollectionFx>;
}

export const userResourceLimitCollectionFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(UserResourceLimitQuerySchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: z.array(UserResourceLimitSchema),
			dataFx: userResourceLimitCollectionFx({
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
