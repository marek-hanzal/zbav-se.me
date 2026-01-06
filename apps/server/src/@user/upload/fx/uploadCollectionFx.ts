import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withUploadQueryBuilder } from "~/app/upload/db/withUploadQueryBuilder";
import { withUploadSelectFx } from "~/app/upload/db/withUploadSelectFx";
import type { UploadQuerySchema } from "~/app/upload/schema/UploadQuerySchema";
import { UploadSchema } from "../schema/UploadSchema";

export namespace uploadCollectionFx {
	export type Props = UploadQuerySchema.Type;
}

export const uploadCollectionFx = Effect.fn("uploadCollectionFx")(function* ({
	cursor,
	filter,
	where,
	sort,
}: uploadCollectionFx.Props) {
	return yield* withCollectionFx({
		select: yield* withUploadSelectFx({
			sort,
		}),
		output: UploadSchema,
		cursor: cursor ?? {
			page: 0,
			size: 10,
		},
		filter,
		where,
		query: withUploadQueryBuilder,
	});
});

export type uploadCollectionFx = ReturnType<typeof uploadCollectionFx>;
