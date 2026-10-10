import { Effect } from "effect";
import { dbFx } from "~/database/fx/dbFx";
import { DateServiceFx } from "~/date/service/DateServiceFx";
import { genIdFn } from "~/identity/fn/genIdFn";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { InvalidRequestErrorFx } from "~/server-error/error/InvalidRequestErrorFx";
import { UploadConfigFx } from "~/user-upload/context/UploadConfigFx";
import type { UploadCreateSchema } from "~/user-upload/schema/UploadCreateSchema";

export namespace uploadCreateFx {
	export interface Props extends UploadCreateSchema.Type {
		userId: string;
	}
}

export const uploadCreateFx = Effect.fn("uploadCreateFx")(function* ({
	userId,
	url,
	...data
}: uploadCreateFx.Props) {
	const logger = yield* getLoggerFx("uploadCreateFx");
	logger.trace("uploadCreateFx", {
		userId,
		url,
		...data,
	});

	const uploadConfig = yield* UploadConfigFx;
	const dateService = yield* DateServiceFx;

	logger.trace("Checking CDN url", {
		userId,
		url,
		cdn: uploadConfig.cdn,
		isValid: url.startsWith(uploadConfig.cdn),
	});

	if (!url.startsWith(uploadConfig.cdn)) {
		return yield* new InvalidRequestErrorFx({
			message: "Only content from the CDN can be uploaded",
		});
	}

	const id = genIdFn();
	const now = dateService.nowFn();

	yield* dbFx(async (kysely) => {
		return kysely
			.insertInto("upload")
			.values({
				...data,
				id,
				userId,
				url,
				createdAt: now.toJSDate(),
			})
			.execute();
	});

	return {
		id,
		url,
	};
});

export type uploadCreateFx = ReturnType<typeof uploadCreateFx>;
