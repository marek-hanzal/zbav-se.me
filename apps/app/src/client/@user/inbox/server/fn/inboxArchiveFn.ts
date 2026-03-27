import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { inboxArchiveFx } from "~/client/@user/inbox/server/fx/inboxArchiveFx";
import { InboxQuerySchema } from "~/client/@user/inbox/server/schema/InboxQuerySchema";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";

export const inboxArchiveFn = createServerFn({
	method: "POST",
})
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(InboxQuerySchema)
	.handler(async ({ data, context: { database, user } }) => {
		return inboxArchiveFx({
			...data,
			scope: {
				userId: user.id,
			},
		}).pipe(
			withKyselyFx(database),
			withDateFx,
			withCatchFx({
				RuntimeErrorFx() {
					throw new Error("RuntimeError");
				},
			}),
			Effect.runPromise,
		);
	});
