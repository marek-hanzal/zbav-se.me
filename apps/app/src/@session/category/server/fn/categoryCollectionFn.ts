import { createServerFn } from "@tanstack/react-start";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { z } from "zod";
import { categoryCollectionFx } from "~/@session/category/server/fx/categoryCollectionFx";
import { CategoryQuerySchema } from "~/@session/category/server/schema/CategoryQuerySchema";
import { CategorySchema } from "~/@session/category/server/schema/CategorySchema";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";

export const categoryCollectionFn = createServerFn()
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(CategoryQuerySchema)
	.handler(async ({ data, context: { database } }) => {
		return zodGuardFx({
			schema: z.array(CategorySchema),
			dataFx: categoryCollectionFx({
				...data,
				scope: {},
			}),
		}).pipe(
			withKyselyFx(database),
			withDateFx,
			withCatchFx({
				RuntimeErrorFx() {
					throw new Error("RuntimeErrorFx");
				},
				ZodErrorFx() {
					throw new Error("ZodError");
				},
			}),
			Effect.runPromise,
		);
	});
