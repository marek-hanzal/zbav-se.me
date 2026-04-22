import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { withUploadQueryBuilderFx } from "~/user/upload/server/db/withUploadQueryBuilderFx";
import { withUploadSourceSelectFx } from "~/user/upload/server/db/withUploadSourceSelectFx";
import type { UploadCountQuerySchema } from "~/user/upload/server/schema/UploadCountQuerySchema";
import type { UploadFilterSchema } from "~/user/upload/server/schema/UploadFilterSchema";

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
		selectFx: withUploadSourceSelectFx({
			sort: [],
		}),
		filter,
		where,
		scope,
		queryFx: withUploadQueryBuilderFx,
	});
});

export type uploadCountFx = ReturnType<typeof uploadCountFx>;
