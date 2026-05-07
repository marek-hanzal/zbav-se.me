import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withFieldOptionSelectFx } from "~/user/field-option/server/db/withFieldOptionSelectFx";
import type { FieldOptionFilterSchema } from "~/user/field-option/server/schema/FieldOptionFilterSchema";
import type { FieldOptionQuerySchema } from "~/user/field-option/server/schema/FieldOptionQuerySchema";

export namespace fieldOptionCollectionFx {
	export interface Props extends FieldOptionQuerySchema.Type {
		scope: FieldOptionFilterSchema.Type;
	}
}

export const fieldOptionCollectionFx = Effect.fn("fieldOptionCollectionFx")(function* ({
	cursor = {
		page: 0,
		size: 10,
	},
	limit,
	filter,
	where,
	scope,
	sort,
}: fieldOptionCollectionFx.Props) {
	const logger = yield* getLoggerFx("fieldOptionCollectionFx");
	logger.trace("fieldOptionCollectionFx", {
		cursor,
		limit,
		filter,
		where,
		scope,
		sort,
	});

	return yield* withCollectionFx({
		selectFx: withFieldOptionSelectFx({
			sort,
		}),
		cursor,
		limit,
		filter,
		where,
		scope,
	});
});

export type fieldOptionCollectionFx = ReturnType<typeof fieldOptionCollectionFx>;
