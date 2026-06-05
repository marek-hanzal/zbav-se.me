import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { withDateServiceFx } from "@/lib/common/date";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { CountSchema } from "@/lib/common/schema";
import { listingCountFx } from "~/buyer/listing/server/fx/listingCountFx";
import { ListingCountQuerySchema } from "~/buyer/listing/server/schema/ListingCountQuerySchema";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";

export namespace listingCountFn {
	export type Error = Effect.Effect.Error<listingCountFx>;
}

export const listingCountFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(ListingCountQuerySchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: CountSchema,
			dataFx: listingCountFx({
				...data,
				userId: user.id,
				scope: {},
			}),
		}).pipe(
			withKyselyFx(database),
			withDateServiceFx(),
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
