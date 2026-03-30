import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { zodGuardFx } from "@/lib/common/schema";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { uploadFetchFx } from "../fx/uploadFetchFx";
import { UploadQuerySchema } from "../schema/UploadQuerySchema";
import { UploadSchema } from "../schema/UploadSchema";

export const uploadFetchFn = createServerFn()
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(UploadQuerySchema)
	.handler(async ({ data, context: { database } }) => {
		return zodGuardFx({
			schema: UploadSchema,
			dataFx: uploadFetchFx({
				...data,
				scope: {},
			}),
		}).pipe(
			withKyselyFx(database),
			withCatchFx({
				NotFoundErrorFx() {
					throw new Error("NotFoundError");
				},
				ZodErrorFx() {
					throw new Error("ZodError");
				},
			}),
			Effect.runPromise,
		);
	});
