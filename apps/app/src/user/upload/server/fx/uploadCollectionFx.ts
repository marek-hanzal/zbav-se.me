import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { withUploadCollectionSelectFx } from "~/user/upload/server/db/withUploadCollectionSelectFx";
import { withUploadQueryBuilderFx } from "~/user/upload/server/db/withUploadQueryBuilderFx";
import type { UploadFilterSchema } from "~/user/upload/server/schema/UploadFilterSchema";
import type { UploadQuerySchema } from "~/user/upload/server/schema/UploadQuerySchema";

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
