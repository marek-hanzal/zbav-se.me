import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { billingInfoFx } from "../server/fx/billingInfoFx";
import { BillingInfoSchema } from "../server/schema/BillingInfoSchema";

export namespace billingInfoFn {
	export type Error = Effect.Effect.Error<billingInfoFx>;
}

export const billingInfoFn = createServerFn()
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
			schema: BillingInfoSchema,
			dataFx: billingInfoFx({
				userId: user.id,
				email: user.email,
			}),
		}).pipe(
			withKyselyFx(database),
			withDateFx,
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
