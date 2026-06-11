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
import { ensureCustomerFx } from "../server/fx/ensureCustomerFx";
import { BillingCustomerSchema } from "../server/schema/BillingCustomerSchema";

export namespace ensureCustomerFn {
	export type Error = Effect.Effect.Error<ensureCustomerFx>;
}

export const ensureCustomerFn = createServerFn({
	method: "POST",
})
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.handler(async ({ context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, {
			userId: user.id,
			email: user.email,
		});

		return zodGuardFx({
			schema: BillingCustomerSchema,
			dataFx: ensureCustomerFx({
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
