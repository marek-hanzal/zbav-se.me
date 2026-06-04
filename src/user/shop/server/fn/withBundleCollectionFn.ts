import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { z } from "zod";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { withStripeConfigFx } from "~/user/billing/server/context/withStripeConfigFx";
import { withStripConfigEnv } from "~/user/billing/server/env/withStripConfigEnv";
import { bundleCollectionFx } from "../fx/bundleCollectionFx";
import { BundleSchema } from "../schema/BundleSchema";

export namespace withBundleCollectionFn {
	export type Error = Effect.Effect.Error<bundleCollectionFx>;
}

export const withBundleCollectionFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.handler(async ({ context: { database, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name);

		return zodGuardFx({
			schema: z.array(BundleSchema),
			dataFx: bundleCollectionFx(),
		}).pipe(
			withKyselyFx(database),
			withStripeConfigFx(withStripConfigEnv()),
			withLoggerFx(rootLogger),
			Effect.tapError((error) =>
				Effect.sync(() => {
					logger.error(error._tag, {
						error,
					});
				}),
			),
			Effect.runPromise,
		);
	});
