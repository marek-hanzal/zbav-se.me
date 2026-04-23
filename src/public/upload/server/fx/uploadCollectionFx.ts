import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withUploadQueryBuilderFx } from "~/public/upload/server/db/withUploadQueryBuilderFx";
import { withUploadSelectFx } from "~/public/upload/server/db/withUploadSelectFx";
import type { UploadFilterSchema } from "~/public/upload/server/schema/UploadFilterSchema";
import type { UploadQuerySchema } from "~/public/upload/server/schema/UploadQuerySchema";

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
	limit,
	filter,
	where,
	scope,
	sort,
}: uploadCollectionFx.Props) {
	const logger = yield* getLoggerFx("uploadCollectionFx");
	logger.trace("uploadCollectionFx", {
		cursor,
		limit,
		filter,
		where,
		scope,
		sort,
	});

	return yield* withCollectionFx({
		selectFx: withUploadSelectFx({
			sort,
		}),
		cursor,
		limit,
		filter,
		where,
		scope,
		queryFx: withUploadQueryBuilderFx,
	});
});

export type uploadCollectionFx = ReturnType<typeof uploadCollectionFx>;
