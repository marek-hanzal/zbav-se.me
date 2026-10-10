import { Effect } from "effect";
import { withCountFx } from "~/database-query/fx/withCountFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { withUploadSelectFx } from "~/user-upload/db/withUploadSelectFx";
import type { UploadCountQuerySchema } from "~/user-upload/schema/UploadCountQuerySchema";
import type { UploadWhereSchema } from "~/user-upload/schema/UploadWhereSchema";

export namespace uploadCountFx {
	export interface Props extends UploadCountQuerySchema.Type {
		scope: UploadWhereSchema.Type;
	}
}

export const uploadCountFx = Effect.fn("uploadCountFx")(function* ({
	where,
	scope,
}: uploadCountFx.Props) {
	const logger = yield* getLoggerFx("uploadCountFx");
	logger.trace("uploadCountFx", {
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withUploadSelectFx({
			sort: [],
		}),
		where,
		scope,
	});
});

export type uploadCountFx = ReturnType<typeof uploadCountFx>;
