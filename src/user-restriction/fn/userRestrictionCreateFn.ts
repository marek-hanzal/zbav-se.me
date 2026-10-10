import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { withKyselyFn } from "~/database/fn/withKyselyFn";
import { withDateServiceFn } from "~/date/fn/withDateServiceFn";
import { withLoggerFn } from "~/log/fn/withLoggerFn";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/request-middleware/middleware/withUserMiddleware";
import { withUserRestrictionContextFn } from "~/user-restriction/fn/withUserRestrictionContextFn";
import { userRestrictionCreateFx } from "~/user-restriction/fx/userRestrictionCreateFx";
import { UserRestrictionCreateFnSchema } from "~/user-restriction/schema/UserRestrictionCreateFnSchema";
import { UserRestrictionSchema } from "~/user-restriction/schema/UserRestrictionSchema";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace userRestrictionCreateFn {
	export type Error = Effect.Error<userRestrictionCreateFx>;
}

export const userRestrictionCreateFn = createServerFn({
	method: "POST",
})
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.validator(UserRestrictionCreateFnSchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: UserRestrictionSchema,
			dataFx: userRestrictionCreateFx({
				...data,
				userId: user.id,
			}),
		}).pipe(
			withKyselyFn(database),
			withDateServiceFn(),
			withUserRestrictionContextFn(),
			withLoggerFn(rootLogger),
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
