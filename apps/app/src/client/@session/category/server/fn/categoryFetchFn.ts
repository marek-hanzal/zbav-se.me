import { createServerFn } from "@tanstack/react-start";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { categoryFetchFx } from "~/client/@session/category/server/fx/categoryFetchFx";
import { CategoryQuerySchema } from "~/client/@session/category/server/schema/CategoryQuerySchema";
import { CategorySchema } from "~/client/@session/category/server/schema/CategorySchema";
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
