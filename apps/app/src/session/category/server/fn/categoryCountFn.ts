import { createServerFn } from "@tanstack/react-start";
import { CountSchema, zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { categoryCountFx } from "~/session/category/server/fx/categoryCountFx";
import { CategoryCountQuerySchema } from "~/session/category/server/schema/CategoryCountQuerySchema";

export const categoryCountFn = createServerFn()
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(CategoryCountQuerySchema)
	.handler(async ({ data, context: { database } }) => {
		return zodGuardFx({
			schema: CountSchema,
			dataFx: categoryCountFx({
				...data,
				scope: {},
			}),
		}).pipe(
			withKyselyFx(database),
			withCatchFx({
				ZodErrorFx() {
					throw new Error("ZodError");
				},
			}),
			Effect.runPromise,
		);
	});
