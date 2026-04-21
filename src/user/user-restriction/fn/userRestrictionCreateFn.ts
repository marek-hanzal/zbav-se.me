import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { UserRestrictionContextFx } from "~/user/user-restriction/server/context/UserRestrictionContextFx";
import { userRestrictionCreateFx } from "~/user/user-restriction/server/fx/userRestrictionCreateFx";
import { withUserRestrictionContextFx } from "~/user/user-restriction/server/fx/withUserRestrictionContextFx";
import { UserRestrictionCreateFnSchema } from "~/user/user-restriction/server/schema/UserRestrictionCreateFnSchema";
import { UserRestrictionSchema } from "~/user/user-restriction/server/schema/UserRestrictionSchema";

export namespace userRestrictionCreateFn {
	export type Error = Effect.Effect.Error<userRestrictionCreateFx>;
}

export const userRestrictionCreateFn = createServerFn({
	method: "POST",
})
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(UserRestrictionCreateFnSchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: UserRestrictionSchema,
			dataFx: Effect.gen(function* () {
				const dateContext = yield* DateContextFx;
				const userRestrictionContext = yield* UserRestrictionContextFx;

				return yield* userRestrictionCreateFx({
					...data,
					userId: user.id,
					availableAt: dateContext
						.now()
						.plus({
							hours: userRestrictionContext.delay[data.restriction],
						})
						.toJSDate(),
				});
			}),
		}).pipe(
			withKyselyFx(database),
			withDateFx,
			withUserRestrictionContextFx(),
			withLoggerFx(rootLogger),
			Effect.tapError((error) => {
				return Effect.sync(() => {
					logger.error(error._tag, {
						error,
					});
				});
			}),
			Effect.runPromise,
		);
	});
