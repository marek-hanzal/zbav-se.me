import { createServerFn } from "@tanstack/react-start";
import { CountSchema, zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { feedCountFx } from "~/client/@buyer/feed/server/fx/feedCountFx";
import { FeedCountQuerySchema } from "~/client/@buyer/feed/server/schema/FeedCountQuerySchema";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";

export const feedCountFn = createServerFn()
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(FeedCountQuerySchema)
	.handler(async ({ data, context: { database, user } }) => {
		return zodGuardFx({
			schema: CountSchema,
			dataFx: feedCountFx({
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
		);
	});
