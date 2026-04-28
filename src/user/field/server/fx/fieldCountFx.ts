import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { withFieldCollectionSelectFx } from "~/user/field/server/db/withFieldCollectionSelectFx";
import { withFieldQueryBuilderFx } from "~/user/field/server/db/withFieldQueryBuilderFx";
import type { FieldCountQuerySchema } from "~/user/field/server/schema/FieldCountQuerySchema";
import type { FieldFilterSchema } from "~/user/field/server/schema/FieldFilterSchema";

export namespace fieldCountFx {
	export interface Props extends FieldCountQuerySchema.Type {
		scope: FieldFilterSchema.Type;
	}
}

export const fieldCountFx = Effect.fn("fieldCountFx")(function* ({
	filter,
	where,
	scope,
}: fieldCountFx.Props) {
	const logger = yield* getLoggerFx("fieldCountFx");
	logger.trace("fieldCountFx", {
		filter,
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withFieldCollectionSelectFx({}),
		filter,
		where,
		scope,
		queryFx: withFieldQueryBuilderFx,
	});
});

export type fieldCountFx = ReturnType<typeof fieldCountFx>;
