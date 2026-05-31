import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { withFieldOptionSelectFx } from "~/user/field-option/server/db/withFieldOptionSelectFx";
import type { FieldOptionCountQuerySchema } from "~/user/field-option/server/schema/FieldOptionCountQuerySchema";
import type { FieldOptionWhereSchema } from "../schema/FieldOptionWhereSchema";

export namespace fieldOptionCountFx {
	export interface Props extends FieldOptionCountQuerySchema.Type {
		scope: FieldOptionWhereSchema.Type;
	}
}

export const fieldOptionCountFx = Effect.fn("fieldOptionCountFx")(function* ({
	where,
	scope,
}: fieldOptionCountFx.Props) {
	const logger = yield* getLoggerFx("fieldOptionCountFx");
	logger.trace("fieldOptionCountFx", {
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withFieldOptionSelectFx({}),
		where,
		scope,
	});
});

export type fieldOptionCountFx = ReturnType<typeof fieldOptionCountFx>;
