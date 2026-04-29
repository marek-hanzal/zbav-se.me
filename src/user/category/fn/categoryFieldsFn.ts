import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { withLoggerFx } from "@/lib/common/log";
import { EntitySchema } from "@/lib/common/schema";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { categoryFieldsFx } from "../server/fx/categoryFieldsFx";

export namespace categoryFieldsFn {
	export type Error = Effect.Effect.Error<categoryFieldsFx>;
}

export const categoryFieldsFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
	])
	.inputValidator(EntitySchema)
	.handler(
		async ({ data: { id }, context: { database, rootLogger }, serverFnMeta: { name } }) => {
			const logger = rootLogger.getChild([
				"fn",
				name,
			]);
			logger.trace(name, {
				id,
			});

			return categoryFieldsFx({
				categoryId: id,
			}).pipe(withKyselyFx(database), withLoggerFx(rootLogger), Effect.runPromise);
		},
	);
