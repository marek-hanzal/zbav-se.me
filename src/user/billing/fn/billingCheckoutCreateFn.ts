import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLinkMiddleware } from "~/server/middleware/withLinkMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { billingCheckoutCreateFx } from "../server/fx/billingCheckoutCreateFx";
import { BillingCheckoutCreateSchema } from "../server/schema/BillingCheckoutCreateSchema";
import { BillingCheckoutSchema } from "../server/schema/BillingCheckoutSchema";

export namespace billingCheckoutCreateFn {
	export type Error = Effect.Effect.Error<billingCheckoutCreateFx>;
}

export const billingCheckoutCreateFn = createServerFn({
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
				dataFx: billingCheckoutCreateFx({
					...data,
					userId: user.id,
					urlSuccess() {
						return link({
							href: "/:locale/app/shop",
							query: {
								locale: data.locale,
								stripe: "success",
							},
						});
					},
					urlCancel() {
						return link({
							href: "/:locale/app/shop",
							query: {
								locale: data.locale,
								stripe: "cancel",
							},
						});
					},
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
		},
	);
