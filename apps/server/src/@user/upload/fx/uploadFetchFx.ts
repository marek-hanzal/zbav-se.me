import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withUploadQueryBuilder } from "~/app/upload/db/withUploadQueryBuilder";
import { withUploadSelect } from "~/app/upload/db/withUploadSelect";
import type { UploadQuerySchema } from "~/app/upload/schema/UploadQuerySchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { UploadSchema } from "../schema/UploadSchema";

export namespace uploadFetchFx {
	export type Props = UploadQuerySchema.Type;
}

export const uploadFetchFx = Effect.fn("uploadFetchFx")(function* ({
	filter,
	where,
	sort,
}: uploadFetchFx.Props) {
	const database = yield* DatabaseContextFx;

	return yield* withFetchFx({
		resource: "upload",
		select: withUploadSelect({
			database,
			sort,
		}),
		output: UploadSchema,
		filter,
		where,
		query: withUploadQueryBuilder,
	});
});

export type uploadFetchFx = ReturnType<typeof uploadFetchFx>;
