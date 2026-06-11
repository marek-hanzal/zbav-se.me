import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { z } from "zod";
import { withDateServiceFx } from "@/lib/common/date";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { withStripeConfigFx } from "~/user/stripe/server/context/withStripeConfigFx";
import { withStripConfigEnv } from "~/user/stripe/server/env/withStripConfigEnv";
import { packageCollectionFx } from "../fx/packageCollectionFx";
import { PackageSchema } from "../schema/PackageSchema";

export namespace packageCollectionFn {
	export type Error = Effect.Effect.Error<packageCollectionFx>;
}

export const packageCollectionFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.handler(async ({ context: { database, rootLogger, user }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name);

		return zodGuardFx({
			schema: z.array(PackageSchema),
			dataFx: packageCollectionFx({
				userId: user.id,
			}),
		}).pipe(
			withKyselyFx(database),
			withDateServiceFx(),
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
