import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { withUploadFx } from "../context/withUploadFx";
import { uploadCreateFx } from "../fx/uploadCreateFx";
import { UploadCreateSchema } from "../schema/UploadCreateSchema";
import { UploadSchema } from "../schema/UploadSchema";

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
		const logger = rootLogger.getChild(name);
		logger.debug(name, data);

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
				cdn: process.env.CDN_URL ?? "",
			}),
			withLoggerFx(logger),
			withCatchFx({
				InvalidRequestErrorFx() {
					throw new Error("InvalidRequestError");
				},
				RuntimeErrorFx() {
					throw new Error("RuntimeError");
				},
				ZodErrorFx({ zod, input }) {
					logger.error("ZodError", {
						zod,
						input,
					});
					throw new Error("ZodError");
				},
			}),
			Effect.runPromise,
		);
	});
