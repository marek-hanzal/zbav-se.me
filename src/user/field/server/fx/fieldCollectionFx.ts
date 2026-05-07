import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withFieldSelectFx } from "~/user/field/server/db/withFieldSelectFx";
import type { FieldFilterSchema } from "~/user/field/server/schema/FieldFilterSchema";
import type { FieldQuerySchema } from "~/user/field/server/schema/FieldQuerySchema";

export namespace fieldCollectionFx {
	export interface Props extends FieldQuerySchema.Type {
		scope: FieldFilterSchema.Type;
	}
}

export const fieldCollectionFx = Effect.fn("fieldCollectionFx")(function* ({
	cursor = {
		page: 0,
		size: 10,
	},
	limit,
	filter,
	where,
	scope,
	sort,
}: fieldCollectionFx.Props) {
	const logger = yield* getLoggerFx("fieldCollectionFx");
	logger.trace("fieldCollectionFx", {
		cursor,
		limit,
		filter,
		where,
		scope,
		sort,
	});

	return yield* withCollectionFx({
		selectFx: withFieldSelectFx({
			sort,
		}),
		cursor,
		limit,
		filter,
		where,
		scope,
	});
});

export type fieldCollectionFx = ReturnType<typeof fieldCollectionFx>;
