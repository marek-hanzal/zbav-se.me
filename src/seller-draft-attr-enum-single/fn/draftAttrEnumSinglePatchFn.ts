import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { z } from "zod";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withDateServiceFx } from "~/date/fx/withDateServiceFx";
import { withLoggerFx } from "~/log/fx/withLoggerFx";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/request-middleware/middleware/withUserMiddleware";
import { draftAttrEnumSinglePatchFx } from "~/seller-draft-attr-enum-single/fx/draftAttrEnumSinglePatchFx";
import { DraftAttrEnumSinglePatchSchema } from "~/seller-draft-attr-enum-single/schema/DraftAttrEnumSinglePatchSchema";
import type { draftAttrOfFx } from "~/user-draft-attr/fx/draftAttrOfFx";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace draftAttrEnumSinglePatchFn {
	export type Error = Effect.Error<draftAttrOfFx>;
}

export const draftAttrEnumSinglePatchFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.validator(DraftAttrEnumSinglePatchSchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: z.any(),
			dataFx: draftAttrEnumSinglePatchFx({
				...data,
				userId: user.id,
			}),
		}).pipe(
			withKyselyFx(database),
			withLoggerFx(rootLogger),
			withDateServiceFx(),
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
