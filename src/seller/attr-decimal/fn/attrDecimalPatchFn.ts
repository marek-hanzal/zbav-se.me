import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { z } from "zod";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import type { attrOfFx } from "../../../user/attr/server/fx/attrOfFx";
import { attrDecimalPatchFx } from "../server/fx/attrDecimalPatchFx";
import { AttrDecimalPatchSchema } from "../server/schema/AttrDecimalPatchSchema";

export namespace attrDecimalPatchFn {
	export type Error = Effect.Effect.Error<attrOfFx>;
}

export const attrDecimalPatchFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(AttrDecimalPatchSchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: z.any(),
			dataFx: attrDecimalPatchFx({
				...data,
				userId: user.id,
			}),
		}).pipe(
			withKyselyFx(database),
			withLoggerFx(rootLogger),
			withDateFx,
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
