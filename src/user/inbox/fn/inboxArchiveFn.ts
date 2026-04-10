import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { withLoggerFx } from "@/lib/common/log";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { inboxArchiveFx } from "~/user/inbox/server/fx/inboxArchiveFx";
import { InboxQuerySchema } from "~/user/inbox/server/schema/InboxQuerySchema";

export const inboxArchiveFn = createServerFn({
	method: "POST",
})
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(InboxQuerySchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.debug(name, data);

		return inboxArchiveFx({
			...data,
			scope: {
				userId: user.id,
			},
		}).pipe(
			withKyselyFx(database),
			withDateFx,
			withLoggerFx(rootLogger),
			withCatchFx({
				RuntimeErrorFx() {
					throw new Error("RuntimeError");
				},
			}),
			Effect.runPromise,
		);
	});
