import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withUploadQueryBuilder } from "~/app/upload/db/withUploadQueryBuilder";
import { withUploadSelect } from "~/app/upload/db/withUploadSelect";
import type { UploadCountQuerySchema } from "~/app/upload/schema/UploadCountQuerySchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace uploadCountFx {
	export type Props = UploadCountQuerySchema.Type;
}

export const uploadCountFx = Effect.fn("uploadCountFx")(function* ({
	filter,
	where,
}: uploadCountFx.Props) {
	const database = yield* DatabaseContextFx;

	return yield* withCountFx({
		select: withUploadSelect({
			database,
		}),
		filter,
		where,
		query: withUploadQueryBuilder,
	});
});

export type uploadCountFx = ReturnType<typeof uploadCountFx>;
