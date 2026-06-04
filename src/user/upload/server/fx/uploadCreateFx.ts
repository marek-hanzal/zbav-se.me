import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import { InvalidRequestErrorFx } from "~/server/error/InvalidRequestErrorFx";
import type { UploadCreateSchema } from "~/user/upload/server/schema/UploadCreateSchema";
import { UploadConfigFx } from "../context/UploadConfigFx";

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
	const dateContext = yield* DateContextFx;

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

	const id = genId();
	const now = dateContext.now();

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
