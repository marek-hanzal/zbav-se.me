import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withUploadQueryBuilderFx } from "~/app/upload/db/withUploadQueryBuilderFx";
import { withUploadSelectFx } from "~/app/upload/db/withUploadSelectFx";
import type { UploadQuerySchema } from "~/app/upload/schema/UploadQuerySchema";
import { UploadSchema } from "../schema/UploadSchema";

export namespace uploadFetchFx {
	export type Props = UploadQuerySchema.Type;
}

export const uploadFetchFx = Effect.fn("uploadFetchFx")(function* ({
	filter,
	where,
	sort,
}: uploadFetchFx.Props) {
	return yield* withFetchFx({
		resource: "upload",
		select: yield* withUploadSelectFx({
			sort,
		}),
		output: UploadSchema,
		filter,
		where,
		queryFx: withUploadQueryBuilderFx,
	});
});

export type uploadFetchFx = ReturnType<typeof uploadFetchFx>;
