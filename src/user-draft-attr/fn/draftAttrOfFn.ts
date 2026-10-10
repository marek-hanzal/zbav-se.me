import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { z } from "zod";
import { withKyselyFn } from "~/database/fn/withKyselyFn";
import { withLoggerFn } from "~/log/fn/withLoggerFn";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { draftAttrOfFx } from "~/user-draft-attr/fx/draftAttrOfFx";
import { DraftAttrOfSchema } from "~/user-draft-attr/schema/DraftAttrOfSchema";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace draftAttrOfFn {
	export type Error = Effect.Error<draftAttrOfFx>;
}

export const draftAttrOfFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
	])
	.validator(
		z
			.looseObject({
				draftId: z.string().min(1),
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
			schema: z.array(DraftAttrOfSchema),
			dataFx: draftAttrOfFx(data),
		}).pipe(
			withKyselyFn(database),
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
