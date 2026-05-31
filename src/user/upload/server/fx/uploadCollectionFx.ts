import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import type { UploadQuerySchema } from "~/user/upload/server/schema/UploadQuerySchema";
import { withUploadSelectFx } from "../db/withUploadSelectFx";
import type { UploadWhereSchema } from "../schema/UploadWhereSchema";

export namespace uploadCollectionFx {
	export interface Props extends UploadQuerySchema.Type {
		scope: UploadWhereSchema.Type;
	}
}

export const uploadCollectionFx = Effect.fn("uploadCollectionFx")(function* ({
	cursor = {
		page: 0,
		size: 10,
	},
	where,
	scope,
	sort,
	limit,
}: uploadCollectionFx.Props) {
	const logger = yield* getLoggerFx("uploadCollectionFx");
	logger.trace("uploadCollectionFx", {
		cursor,
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
		where,
		scope,
		limit,
	});
});

export type uploadCollectionFx = ReturnType<typeof uploadCollectionFx>;
