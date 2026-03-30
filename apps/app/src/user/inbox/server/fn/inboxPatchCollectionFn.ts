import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { z } from "zod";
import { zodGuardFx } from "@/lib/common/schema";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { inboxPatchCollectionFx } from "~/user/inbox/server/fx/inboxPatchCollectionFx";
import { InboxPatchCollectionSchema } from "~/user/inbox/server/schema/InboxPatchCollectionSchema";
import { InboxSchema } from "~/user/inbox/server/schema/InboxSchema";

export const inboxPatchCollectionFn = createServerFn({
	method: "POST",
})
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(InboxPatchCollectionSchema)
	.handler(async ({ data, context: { database, user } }) => {
		return zodGuardFx({
			schema: z.array(InboxSchema),
			dataFx: inboxPatchCollectionFx({
				...data,
				scope: {
					userId: user.id,
				},
			}),
		}).pipe(
			withKyselyFx(database),
			withCatchFx({
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
