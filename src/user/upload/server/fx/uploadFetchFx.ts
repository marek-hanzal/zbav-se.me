import { Effect } from "effect";
import { withFetchFx } from "@/lib/common/fetch";
import { getLoggerFx } from "@/lib/common/log";
import { withUploadSelectFx } from "~/user/upload/server/db/withUploadSelectFx";
import type { UploadQuerySchema } from "~/user/upload/server/schema/UploadQuerySchema";
import type { UploadWhereSchema } from "../schema/UploadWhereSchema";

export namespace uploadFetchFx {
	export interface Props extends UploadQuerySchema.Type {
		scope: UploadWhereSchema.Type;
	}
}

export const uploadFetchFx = Effect.fn("uploadFetchFx")(function* ({
	where,
	scope,
	sort,
}: uploadFetchFx.Props) {
	const logger = yield* getLoggerFx("uploadFetchFx");
	logger.trace("uploadFetchFx", {
		where,
		scope,
		sort,
	});

	return yield* withFetchFx({
		resource: "upload",
		selectFx: withUploadSelectFx({
			sort,
		}),
		where,
		scope,
	});
});

export type uploadFetchFx = ReturnType<typeof uploadFetchFx>;
