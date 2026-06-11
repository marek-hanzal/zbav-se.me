import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { withDateServiceFx } from "@/lib/common/date";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { withStripeConfigFx } from "../server/context/withStripeConfigFx";
import { withStripConfigEnv } from "../server/env/withStripConfigEnv";
import { checkoutReturnSyncFx } from "../server/fx/checkoutReturnSyncFx";
import { CheckoutReturnSyncResultSchema } from "../server/schema/CheckoutReturnSyncResultSchema";
import { CheckoutReturnSyncSchema } from "../server/schema/CheckoutReturnSyncSchema";

export namespace checkoutReturnSyncFn {
	export type Error = Effect.Effect.Error<checkoutReturnSyncFx>;
}

export const checkoutReturnSyncFn = createServerFn({
	method: "POST",
})
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(CheckoutReturnSyncSchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, {
			userId: user.id,
			sessionId: data.sessionId,
		});

		return zodGuardFx({
			schema: CheckoutReturnSyncResultSchema,
			dataFx: checkoutReturnSyncFx({
				...data,
				userId: user.id,
			}),
		}).pipe(
			withKyselyFx(database),
			withDateServiceFx(),
			withStripeConfigFx(withStripConfigEnv()),
			withLoggerFx(rootLogger),
			Effect.tapError((error) => {
				return Effect.sync(() => {
					logger.error(error._tag, {
						error,
					});
				});
			}),
			Effect.runPromise,
		);
	});
