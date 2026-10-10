import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { z } from "zod";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withLoggerFx } from "~/log/fx/withLoggerFx";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { categoryAttrOfFx } from "~/user-category/fx/categoryAttrOfFx";
import { CategoryAttrOfSchema } from "~/user-category/schema/CategoryAttrOfSchema";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace categoryAttrOfFn {
	export type Error = Effect.Error<categoryAttrOfFx>;
}

export const categoryAttrOfFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
	])
	.validator(
		z
			.looseObject({
				categoryId: z.string().min(1),
			})
			.strip(),
	)
	.handler(async ({ data, context: { database, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: z.array(CategoryAttrOfSchema),
			dataFx: categoryAttrOfFx(data),
		}).pipe(
			withKyselyFx(database),
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
