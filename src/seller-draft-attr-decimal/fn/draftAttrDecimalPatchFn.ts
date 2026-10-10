import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { z } from "zod";
import { withKyselyFn } from "~/database/fn/withKyselyFn";
import { withDateServiceFn } from "~/date/fn/withDateServiceFn";
import { withLoggerFn } from "~/log/fn/withLoggerFn";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/request-middleware/middleware/withUserMiddleware";
import { draftAttrDecimalPatchFx } from "~/seller-draft-attr-decimal/fx/draftAttrDecimalPatchFx";
import { DraftAttrDecimalPatchSchema } from "~/seller-draft-attr-decimal/schema/DraftAttrDecimalPatchSchema";
import type { draftAttrOfFx } from "~/user-draft-attr/fx/draftAttrOfFx";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace draftAttrDecimalPatchFn {
	export type Error = Effect.Error<draftAttrOfFx>;
}

export const draftAttrDecimalPatchFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.validator(DraftAttrDecimalPatchSchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: z.any(),
			dataFx: draftAttrDecimalPatchFx({
				...data,
				userId: user.id,
			}),
		}).pipe(
			withKyselyFn(database),
			withLoggerFn(rootLogger),
			withDateServiceFn(),
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
