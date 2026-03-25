import { createServerFn } from "@tanstack/react-start";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { feedCreateFx } from "~/server/@buyer/feed/fx/feedCreateFx";
import { FeedCreateSchema } from "~/server/@buyer/feed/schema/FeedCreateSchema";
import { FeedSchema } from "~/server/@buyer/feed/schema/FeedSchema";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";

export const feedCreateFn = createServerFn({
	method: "POST",
})
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(FeedCreateSchema)
	.handler(async ({ data, context: { database, user } }) =>
		Effect.gen(function* () {
			return yield* zodGuardFx({
				schema: FeedSchema,
				dataFx: feedCreateFx({
					...data,
					userId: user.id,
				}),
			});
		}).pipe(
			withKyselyFx(database),
			withDateFx,
			withCatchFx({
				NotFoundErrorFx() {
					throw new Error("NotFoundErrorFx");
				},
				ZodErrorFx() {
					throw new Error("ZodErrorFx");
				},
				RuntimeErrorFx(e) {
					throw new Error("RuntimeErrorFx");
				},
				ConflictErrorFx(e) {
					throw new Error("ConflictErrorFx");
				},
			}),
			Effect.runPromise,
		),
	);
