import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withFieldCollectionSelectFx } from "~/user/field/server/db/withFieldCollectionSelectFx";
import { withFieldQueryBuilderFx } from "~/user/field/server/db/withFieldQueryBuilderFx";
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
		selectFx: withFieldCollectionSelectFx({
			sort,
		}),
		cursor,
		limit,
		filter,
		where,
		scope,
		queryFx: withFieldQueryBuilderFx,
	});
});

export type fieldCollectionFx = ReturnType<typeof fieldCollectionFx>;
