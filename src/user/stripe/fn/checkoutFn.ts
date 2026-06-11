import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { withDateServiceFx } from "@/lib/common/date";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLinkMiddleware } from "~/server/middleware/withLinkMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { withStripeConfigFx } from "../server/context/withStripeConfigFx";
import { withStripConfigEnv } from "../server/env/withStripConfigEnv";
import { checkoutFx } from "../server/fx/checkoutFx";
import { BillingCheckoutCreateSchema } from "../server/schema/BillingCheckoutCreateSchema";
import { BillingCheckoutSchema } from "../server/schema/BillingCheckoutSchema";

export namespace checkoutFn {
	export type Error = Effect.Effect.Error<checkoutFx>;
}

export const checkoutFn = createServerFn({
	method: "POST",
})
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
		withLinkMiddleware,
	])
	.inputValidator(BillingCheckoutCreateSchema)
	.handler(
		async ({ data, context: { database, link, user, rootLogger }, serverFnMeta: { name } }) => {
			const logger = rootLogger.getChild([
				"fn",
				name,
			]);
			logger.trace(name, data);

			return zodGuardFx({
				schema: BillingCheckoutSchema,
				dataFx: checkoutFx({
					...data,
					userId: user.id,
					urlSuccess() {
						return link({
							href: "/:locale/app/shop/success",
							query: {
								locale: data.locale,
							},
						});
					},
					urlCancel() {
						return link({
							href: "/:locale/app/shop/cancel",
							query: {
								locale: data.locale,
							},
						});
					},
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
		},
	);
