import { createServerFn } from "@tanstack/react-start";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { feedPatchFx } from "~/client/@buyer/feed/server/fx/feedPatchFx";
import { FeedPatchSchema } from "~/client/@buyer/feed/server/schema/FeedPatchSchema";
import { FeedSchema } from "~/client/@buyer/feed/server/schema/FeedSchema";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";

export const feedPatchFn = createServerFn({
	method: "POST",
})
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(FeedPatchSchema)
	.handler(async ({ data, context: { database, user } }) => {
		return zodGuardFx({
			schema: FeedSchema,
			dataFx: feedPatchFx({
				...data,
				scope: {
					userId: user.id,
				},
			}),
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
				RuntimeErrorFx() {
					throw new Error("RuntimeErrorFx");
				},
			}),
			Effect.runPromise,
		);
	});
