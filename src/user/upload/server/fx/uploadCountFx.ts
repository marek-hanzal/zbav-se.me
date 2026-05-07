import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import type { UploadCountQuerySchema } from "~/user/upload/server/schema/UploadCountQuerySchema";
import type { UploadFilterSchema } from "~/user/upload/server/schema/UploadFilterSchema";
import { withUploadSelectFx } from "../db/withUploadSelectFx";

export namespace uploadCountFx {
	export interface Props extends UploadCountQuerySchema.Type {
		scope: UploadFilterSchema.Type;
	}
}

export const uploadCountFx = Effect.fn("uploadCountFx")(function* ({
	filter,
	where,
	scope,
}: uploadCountFx.Props) {
	const logger = yield* getLoggerFx("uploadCountFx");
	logger.trace("uploadCountFx", {
		filter,
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withUploadSelectFx({
			sort: [],
		}),
		filter,
		where,
		scope,
	});
});

export type uploadCountFx = ReturnType<typeof uploadCountFx>;
