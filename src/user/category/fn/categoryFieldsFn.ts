import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { z } from "zod";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { EntitySchema } from "@/lib/common/schema";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { FieldSchema } from "~/user/field/server/schema/FieldSchema";
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

			return zodGuardFx({
				schema: z.array(FieldSchema),
				dataFx: categoryFieldsFx({
					categoryId: id,
				}),
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
		},
	);
