import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { CountSchema } from "@/lib/common/schema";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { categoryCountFx } from "~/session/category/server/fx/categoryCountFx";
import { CategoryCountQuerySchema } from "~/session/category/server/schema/CategoryCountQuerySchema";

export const categoryCountFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(CategoryCountQuerySchema)
	.handler(async ({ data, context: { database, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild(name);
		logger.debug(name, data);

		return zodGuardFx({
			schema: CountSchema,
			dataFx: categoryCountFx({
				...data,
				scope: {},
			}),
		}).pipe(
			withKyselyFx(database),
			withLoggerFx(logger),
			withCatchFx({
				ZodErrorFx() {
					throw new Error("ZodError");
				},
			}),
			Effect.runPromise,
		);
	});
