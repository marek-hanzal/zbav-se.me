import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { zodGuardFx } from "@/lib/common/schema";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { inboxPatchFx } from "~/user/inbox/server/fx/inboxPatchFx";
import { InboxPatchSchema } from "~/user/inbox/server/schema/InboxPatchSchema";
import { InboxSchema } from "~/user/inbox/server/schema/InboxSchema";

export const inboxPatchFn = createServerFn({
	method: "POST",
})
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(InboxPatchSchema)
	.handler(async ({ data, context: { database, user } }) => {
		return zodGuardFx({
			schema: InboxSchema,
			dataFx: inboxPatchFx({
				...data,
				scope: {
					userId: user.id,
				},
			}),
		}).pipe(
			withKyselyFx(database),
			withCatchFx({
				NotFoundErrorFx() {
					throw new Error("NotFoundError");
				},
				RuntimeErrorFx() {
					throw new Error("RuntimeError");
				},
				ZodErrorFx() {
					throw new Error("ZodError");
				},
			}),
			Effect.runPromise,
		);
	});
