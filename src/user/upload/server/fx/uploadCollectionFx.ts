import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import type { UploadFilterSchema } from "~/user/upload/server/schema/UploadFilterSchema";
import type { UploadQuerySchema } from "~/user/upload/server/schema/UploadQuerySchema";
import { withUploadSelectFx } from "../db/withUploadSelectFx";

export namespace uploadCollectionFx {
	export interface Props extends UploadQuerySchema.Type {
		scope: UploadFilterSchema.Type;
	}
}

export const uploadCollectionFx = Effect.fn("uploadCollectionFx")(function* ({
	cursor = {
		page: 0,
		size: 10,
	},
	filter,
	where,
	scope,
	sort,
	limit,
}: uploadCollectionFx.Props) {
	const logger = yield* getLoggerFx("uploadCollectionFx");
	logger.trace("uploadCollectionFx", {
		cursor,
		filter,
		where,
		scope,
		sort,
		limit,
	});

	return yield* withCollectionFx({
		selectFx: withUploadSelectFx({
			sort,
		}),
		cursor,
		filter,
		where,
		scope,
		limit,
	});
});

export type uploadCollectionFx = ReturnType<typeof uploadCollectionFx>;
