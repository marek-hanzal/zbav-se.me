import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { withKyselyFn } from "~/database/fn/withKyselyFn";
import { withDateServiceFn } from "~/date/fn/withDateServiceFn";
import { withLoggerFn } from "~/log/fn/withLoggerFn";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/request-middleware/middleware/withUserMiddleware";
import { categoryFetchFx } from "~/user-category/fx/categoryFetchFx";
import { CategoryQuerySchema } from "~/user-category/schema/CategoryQuerySchema";
import { CategorySchema } from "~/user-category/schema/CategorySchema";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace categoryFetchFn {
	export type Error = Effect.Error<categoryFetchFx>;
}

export const categoryFetchFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.validator(CategoryQuerySchema)
	.handler(async ({ data, context: { database, rootLogger, user }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: CategorySchema,
			dataFx: categoryFetchFx({
				...data,
				userId: user.id,
				scope: {},
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
