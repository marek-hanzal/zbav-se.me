import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { withDateServiceFx } from "@/lib/common/date";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { categoryFetchFx } from "~/user/category/server/fx/categoryFetchFx";
import { CategoryQuerySchema } from "~/user/category/server/schema/CategoryQuerySchema";
import { CategorySchema } from "~/user/category/server/schema/CategorySchema";

export namespace categoryFetchFn {
	export type Error = Effect.Effect.Error<categoryFetchFx>;
}

export const categoryFetchFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(CategoryQuerySchema)
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
			withKyselyFx(database),
			withDateServiceFx(),
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
