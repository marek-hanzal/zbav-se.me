import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withUploadQueryBuilderFx } from "~/user/upload/server/db/withUploadQueryBuilderFx";
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
	return yield* withFetchFx({
		resource: "upload",
		selectFx: withUploadSelectFx({
			sort,
		}),
		filter,
		where,
		scope,
		queryFx: withUploadQueryBuilderFx,
	});
});

export type uploadFetchFx = ReturnType<typeof uploadFetchFx>;
