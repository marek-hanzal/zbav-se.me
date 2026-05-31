import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import type { UploadCountQuerySchema } from "~/user/upload/server/schema/UploadCountQuerySchema";
import { withUploadSelectFx } from "../db/withUploadSelectFx";
import type { UploadWhereSchema } from "../schema/UploadWhereSchema";

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
