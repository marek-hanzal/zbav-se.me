import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { CountSchema, zodGuardFx } from "@/lib/common/schema";
import { draftCountFx } from "~/seller/draft/server/fx/draftCountFx";
import { DraftCountQuerySchema } from "~/seller/draft/server/schema/DraftCountQuerySchema";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";

export const draftCountFn = createServerFn()
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(DraftCountQuerySchema)
	.handler(async ({ data, context: { database, user } }) =>
		zodGuardFx({
			schema: CountSchema,
			dataFx: draftCountFx({
				...data,
				scope: {
					userId: user.id,
				},
			}),
		}).pipe(
			withKyselyFx(database),
			withCatchFx({
				ZodErrorFx() {
					throw new Error("ZodError");
				},
			}),
			Effect.runPromise,
		),
	);
