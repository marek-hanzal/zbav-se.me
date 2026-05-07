import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { ViteEnvSchema } from "~/common/env/ViteEnvSchema";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { withUploadFx } from "../server/context/withUploadFx";
import { uploadCreateFx } from "../server/fx/uploadCreateFx";
import { UploadCreateSchema } from "../server/schema/UploadCreateSchema";
import { UploadSchema } from "../server/schema/UploadSchema";

export namespace uploadCreateFn {
	export type Error = Effect.Effect.Error<uploadCreateFx>;
}

export const uploadCreateFn = createServerFn({
	method: "POST",
})
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(UploadCreateSchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);
		const viteConfig = ViteEnvSchema.parse(process.env);

		return zodGuardFx({
			schema: UploadSchema,
			dataFx: uploadCreateFx({
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
