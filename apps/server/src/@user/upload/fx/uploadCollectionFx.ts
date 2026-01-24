import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withUploadCollectionSelectFx } from "~/@user/upload/db/withUploadCollectionSelectFx";
import { withUploadQueryBuilderFx } from "~/@user/upload/db/withUploadQueryBuilderFx";
import type { UploadFilterSchema } from "~/@user/upload/schema/UploadFilterSchema";
import type { UploadQuerySchema } from "~/@user/upload/schema/UploadQuerySchema";

export namespace uploadCollectionFx {
	export interface Props extends UploadQuerySchema.Type {
		scope: UploadFilterSchema.Type;
	}
}

export const uploadCollectionFx = Effect.fn("uploadCollectionFx")(function* ({
	cursor,
	filter,
	where,
	scope,
	sort,
}: uploadCollectionFx.Props) {
	return yield* withCollectionFx({
		selectFx: withUploadCollectionSelectFx({
			sort,
		}),
		cursor: cursor ?? {
			page: 0,
			size: 10,
		},
		filter,
		where,
		scope,
		queryFx: withUploadQueryBuilderFx,
	});
});

export type uploadCollectionFx = ReturnType<typeof uploadCollectionFx>;
