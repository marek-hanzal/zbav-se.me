import { createServerFn } from "@tanstack/react-start";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { categoryFetchFx } from "~/server/@session/category/fx/categoryFetchFx";
import { CategoryQuerySchema } from "~/server/@session/category/schema/CategoryQuerySchema";
import { CategorySchema } from "~/server/@session/category/schema/CategorySchema";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";

export const categoryFetchFn = createServerFn()
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(CategoryQuerySchema)
	.handler(async ({ data, context: { database } }) => {
		return zodGuardFx({
			schema: CategorySchema,
			dataFx: categoryFetchFx({
				...data,
				scope: {},
			}),
		}).pipe(
			withKyselyFx(database),
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
