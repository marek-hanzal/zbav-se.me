import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { z } from "zod";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { categoryCollectionFx } from "~/session/category/server/fx/categoryCollectionFx";
import { CategoryQuerySchema } from "~/session/category/server/schema/CategoryQuerySchema";
import { CategorySchema } from "~/session/category/server/schema/CategorySchema";

export const categoryCollectionFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(CategoryQuerySchema)
	.handler(async ({ data, context: { database, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: z.array(CategorySchema),
			dataFx: categoryCollectionFx({
				...data,
				scope: {},
			}),
		}).pipe(
			withKyselyFx(database),
			withDateFx,
			withLoggerFx(rootLogger),
			withCatchFx({
				RuntimeErrorFx() {
					throw new Error("RuntimeErrorFx");
				},
				ZodErrorFx({ zod, input }) {
					logger.error("ZodError", {
						zod,
						input,
					});
					throw new Error("ZodError");
				},
			}),
			Effect.runPromise,
		);
	});
