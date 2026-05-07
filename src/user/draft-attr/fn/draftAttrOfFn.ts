import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { z } from "zod";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { draftAttrOfFx } from "../server/fx/draftAttrOfFx";
import { DraftAttrOfSchema } from "../server/schema/DraftAttrOfSchema";

export namespace draftAttrOfFn {
	export type Error = Effect.Effect.Error<draftAttrOfFx>;
}

export const draftAttrOfFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
	])
	.inputValidator(
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
