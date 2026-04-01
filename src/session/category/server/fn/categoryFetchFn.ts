import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { categoryFetchFx } from "~/session/category/server/fx/categoryFetchFx";
import { CategoryQuerySchema } from "~/session/category/server/schema/CategoryQuerySchema";
import { CategorySchema } from "~/session/category/server/schema/CategorySchema";

export const categoryFetchFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(CategoryQuerySchema)
	.handler(async ({ data, context: { database, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild(name);
		logger.debug(name, data);

		return zodGuardFx({
			schema: CategorySchema,
			dataFx: categoryFetchFx({
				...data,
				scope: {},
			}),
		}).pipe(
			withKyselyFx(database),
			withLoggerFx(logger),
			withCatchFx({
				NotFoundErrorFx() {
					throw new Error("NotFoundError");
				},
				ZodErrorFx() {
					throw new Error("ZodError");
				},
			}),
			Effect.runPromise,
		);
	});
