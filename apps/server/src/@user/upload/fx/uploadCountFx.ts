import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withUploadQueryBuilderFx } from "~/app/upload/db/withUploadQueryBuilderFx";
import { withUploadSelectFx } from "~/app/upload/db/withUploadSelectFx";
import type { UploadCountQuerySchema } from "~/app/upload/schema/UploadCountQuerySchema";

export namespace uploadCountFx {
	export type Props = UploadCountQuerySchema.Type;
}

export const uploadCountFx = Effect.fn("uploadCountFx")(function* ({
	filter,
	where,
}: uploadCountFx.Props) {
	return yield* withCountFx({
		select: yield* withUploadSelectFx({}),
		filter,
		where,
		queryFx: withUploadQueryBuilderFx,
	});
});

export type uploadCountFx = ReturnType<typeof uploadCountFx>;
