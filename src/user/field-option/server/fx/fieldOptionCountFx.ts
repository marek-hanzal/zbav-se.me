import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { withFieldOptionCollectionSelectFx } from "~/user/field-option/server/db/withFieldOptionCollectionSelectFx";
import { withFieldOptionQueryBuilderFx } from "~/user/field-option/server/db/withFieldOptionQueryBuilderFx";
import type { FieldOptionCountQuerySchema } from "~/user/field-option/server/schema/FieldOptionCountQuerySchema";
import type { FieldOptionFilterSchema } from "~/user/field-option/server/schema/FieldOptionFilterSchema";

export namespace fieldOptionCountFx {
	export interface Props extends FieldOptionCountQuerySchema.Type {
		scope: FieldOptionFilterSchema.Type;
	}
}

export const fieldOptionCountFx = Effect.fn("fieldOptionCountFx")(function* ({
	filter,
	where,
	scope,
}: fieldOptionCountFx.Props) {
	const logger = yield* getLoggerFx("fieldOptionCountFx");
	logger.trace("fieldOptionCountFx", {
		filter,
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withFieldOptionCollectionSelectFx({}),
		filter,
		where,
		scope,
		queryFx: withFieldOptionQueryBuilderFx,
	});
});

export type fieldOptionCountFx = ReturnType<typeof fieldOptionCountFx>;
