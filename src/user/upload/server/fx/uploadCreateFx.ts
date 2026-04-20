import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { InvalidRequestErrorFx } from "~/server/error/InvalidRequestErrorFx";
import { UploadContextFx } from "~/user/upload/server/context/UploadContextFx";
import type { UploadCreateSchema } from "~/user/upload/server/schema/UploadCreateSchema";

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

	const { kysely } = yield* KyselyContextFx;
	const uploadContext = yield* UploadContextFx;
	const dateContext = yield* DateContextFx;

	logger.trace("Checking CDN url", {
		userId,
		url,
		cdn: uploadContext.cdn,
		isValid: url.startsWith(uploadContext.cdn),
	});

	if (!url.startsWith(uploadContext.cdn)) {
		return yield* new InvalidRequestErrorFx({
			message: "Only content from the CDN can be uploaded",
		});
	}

	const id = genId();
	const now = dateContext.now();

	yield* tryDbFx(async () =>
		kysely
			.insertInto("upload")
			.values({
				...data,
				id,
				userId,
				url,
				createdAt: now.toJSDate(),
			})
			.execute(),
	);

	return {
		id,
		url,
	};
});

export type uploadCreateFx = ReturnType<typeof uploadCreateFx>;
