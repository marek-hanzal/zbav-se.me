import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { z } from "zod";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withDateServiceFx } from "~/date/fx/withDateServiceFx";
import { withLoggerFx } from "~/log/fx/withLoggerFx";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/request-middleware/middleware/withUserMiddleware";
import { categoryCollectionFx } from "~/user-category/fx/categoryCollectionFx";
import { CategoryQuerySchema } from "~/user-category/schema/CategoryQuerySchema";
import { CategorySchema } from "~/user-category/schema/CategorySchema";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace categoryCollectionFn {
	export type Error = Effect.Error<categoryCollectionFx>;
}

export const categoryCollectionFn = createServerFn()
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
			schema: z.array(CategorySchema),
			dataFx: categoryCollectionFx({
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
