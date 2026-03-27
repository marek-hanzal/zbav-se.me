import { createServerFn } from "@tanstack/react-start";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { z } from "zod";
import { draftCollectionFx } from "~/seller/draft/server/fx/draftCollectionFx";
import { DraftQuerySchema } from "~/seller/draft/server/schema/DraftQuerySchema";
import { DraftSchema } from "~/seller/draft/server/schema/DraftSchema";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";

export const draftCollectionFn = createServerFn()
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(DraftQuerySchema)
	.handler(async ({ data, context: { database, user } }) =>
		zodGuardFx({
			schema: z.array(DraftSchema),
			dataFx: draftCollectionFx({
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
