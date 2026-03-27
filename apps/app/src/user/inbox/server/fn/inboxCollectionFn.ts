import { createServerFn } from "@tanstack/react-start";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { z } from "zod";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { inboxCollectionFx } from "~/user/inbox/server/fx/inboxCollectionFx";
import { InboxQuerySchema } from "~/user/inbox/server/schema/InboxQuerySchema";
import { InboxSchema } from "~/user/inbox/server/schema/InboxSchema";

export const inboxCollectionFn = createServerFn()
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(InboxQuerySchema)
	.handler(async ({ data, context: { database, user } }) => {
		return zodGuardFx({
			schema: z.array(InboxSchema),
			dataFx: inboxCollectionFx({
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
