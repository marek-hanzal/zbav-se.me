import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { withFieldSelectFx } from "~/user/field/server/db/withFieldSelectFx";
import type { FieldCountQuerySchema } from "~/user/field/server/schema/FieldCountQuerySchema";
import type { FieldWhereSchema } from "../schema/FieldWhereSchema";

export namespace fieldCountFx {
	export interface Props extends FieldCountQuerySchema.Type {
		scope: FieldWhereSchema.Type;
	}
}

export const fieldCountFx = Effect.fn("fieldCountFx")(function* ({
	where,
	scope,
}: fieldCountFx.Props) {
	const logger = yield* getLoggerFx("fieldCountFx");
	logger.trace("fieldCountFx", {
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withFieldSelectFx({}),
		where,
		scope,
	});
});

export type fieldCountFx = ReturnType<typeof fieldCountFx>;
