import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { ViteEnvSchema } from "~/common/env/ViteEnvSchema";
import { listingCreateFx } from "~/seller/listing/server/fx/listingCreateFx";
import { ListingCreateSchema } from "~/seller/listing/server/schema/ListingCreateSchema";
import { ListingSchema } from "~/seller/listing/server/schema/ListingSchema";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { withUploadFx } from "~/user/upload/server/context/withUploadFx";

export namespace listingCreateFn {
	export type Error = Effect.Effect.Error<listingCreateFx>;
}

export const listingCreateFn = createServerFn({
	method: "POST",
})
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(ListingCreateSchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		const viteConfig = ViteEnvSchema.parse(process.env);

		return zodGuardFx({
			schema: ListingSchema,
			dataFx: listingCreateFx({
				...data,
				userId: user.id,
			}),
		}).pipe(
			withKyselyFx(database),
			withDateFx,
			withUploadFx({
				cdn: viteConfig.VITE_CONTENT_CDN,
			}),
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
