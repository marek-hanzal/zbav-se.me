import { Effect } from "effect";
import { withFetchFx } from "@/lib/common/fetch";
import { getLoggerFx } from "@/lib/common/log";
import { withUploadSelectFx } from "~/user/upload/server/db/withUploadSelectFx";
import type { UploadFilterSchema } from "~/user/upload/server/schema/UploadFilterSchema";
import type { UploadQuerySchema } from "~/user/upload/server/schema/UploadQuerySchema";

export namespace uploadFetchFx {
	export interface Props extends UploadQuerySchema.Type {
		scope: UploadFilterSchema.Type;
	}
}

export const uploadFetchFx = Effect.fn("uploadFetchFx")(function* ({
	filter,
	where,
	scope,
	sort,
}: uploadFetchFx.Props) {
	const logger = yield* getLoggerFx("uploadFetchFx");
	logger.trace("uploadFetchFx", {
		filter,
		where,
		scope,
		sort,
	});

	return yield* withFetchFx({
		resource: "upload",
		selectFx: withUploadSelectFx({
			sort,
		}),
		filter,
		where,
		scope,
	});
});

export type uploadFetchFx = ReturnType<typeof uploadFetchFx>;
