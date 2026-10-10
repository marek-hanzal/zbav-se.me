import { Effect } from "effect";
import { withCollectionFx } from "~/database-query/fx/withCollectionFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { withUploadSelectFx } from "~/user-upload/db/withUploadSelectFx";
import type { UploadQuerySchema } from "~/user-upload/schema/UploadQuerySchema";
import type { UploadWhereSchema } from "~/user-upload/schema/UploadWhereSchema";

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
