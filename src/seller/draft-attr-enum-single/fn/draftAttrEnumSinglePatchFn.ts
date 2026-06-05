import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { z } from "zod";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import type { draftAttrOfFx } from "../../../user/draft-attr/server/fx/draftAttrOfFx";
import { draftAttrEnumSinglePatchFx } from "../server/fx/draftAttrEnumSinglePatchFx";
import { DraftAttrEnumSinglePatchSchema } from "../server/schema/DraftAttrEnumSinglePatchSchema";
import { withDateServiceFx } from "@/lib/common/date";

export namespace draftAttrEnumSinglePatchFn {
	export type Error = Effect.Effect.Error<draftAttrOfFx>;
}

export const draftAttrEnumSinglePatchFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(DraftAttrEnumSinglePatchSchema)
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
