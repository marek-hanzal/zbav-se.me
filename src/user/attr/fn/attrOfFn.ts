import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { z } from "zod";
import { withLoggerFx } from "@/lib/common/log";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { attrOfFx } from "../server/fx/attrOfFx";

export namespace attrOfFn {
	export type Error = Effect.Effect.Error<attrOfFx>;
}

export const attrOfFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
	])
	.inputValidator(
		z
			.looseObject({
				listingId: z.string().min(1),
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

		const foo = await attrOfFx(data).pipe(
			withKyselyFx(database),
			withLoggerFx(rootLogger),
			Effect.runPromise,
		);

        return foo;

		// return zodGuardFx({
		// 	schema: z.array(FieldSchema),
		// 	dataFx: attrOfFx(data),
		// }).pipe(
		// 	withKyselyFx(database),
		// 	withLoggerFx(rootLogger),
		// 	Effect.tapError((error) => {
		// 		return Effect.sync(() => {
		// 			logger.error(error._tag, {
		// 				error,
		// 			});
		// 		});
		// 	}),
		// 	Effect.runPromise,
		// );
	});
