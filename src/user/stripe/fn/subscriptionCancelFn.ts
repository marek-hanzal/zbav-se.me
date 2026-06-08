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
import { subscriptionCancelFx } from "../server/fx/subscriptionCancelFx";
import { BillingSubscriptionCancelResultSchema } from "../server/schema/BillingSubscriptionCancelResultSchema";
import { BillingSubscriptionCancelSchema } from "../server/schema/BillingSubscriptionCancelSchema";

export namespace subscriptionCancelFn {
	export type Error = Effect.Effect.Error<subscriptionCancelFx>;
}

export const subscriptionCancelFn = createServerFn({
	method: "POST",
})
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(BillingSubscriptionCancelSchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: BillingSubscriptionCancelResultSchema,
			dataFx: subscriptionCancelFx({
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
