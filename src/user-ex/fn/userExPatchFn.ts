import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { withKyselyFn } from "~/database/fn/withKyselyFn";
import { withDateServiceFn } from "~/date/fn/withDateServiceFn";
import { withLoggerFn } from "~/log/fn/withLoggerFn";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/request-middleware/middleware/withUserMiddleware";
import { userExPatchFx } from "~/user-ex/fx/userExPatchFx";
import { UserExPatchSchema } from "~/user-ex/schema/UserExPatchSchema";
import { UserExSchema } from "~/user-ex/schema/UserExSchema";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace userExPatchFn {
	export type Error = Effect.Error<userExPatchFx>;
}

export const userExPatchFn = createServerFn({
	method: "POST",
})
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.validator(UserExPatchSchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: UserExSchema,
			dataFx: userExPatchFx({
				...data,
				userId: user.id,
			}),
		}).pipe(
			withKyselyFn(database),
			withDateServiceFn(),
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
