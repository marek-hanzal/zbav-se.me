import { Effect } from "effect";
import { withFetchFx } from "@/lib/common/fetch";
import { getLoggerFx } from "@/lib/common/log";
import { withFieldSelectFx } from "~/user/field/server/db/withFieldSelectFx";
import type { FieldFilterSchema } from "~/user/field/server/schema/FieldFilterSchema";
import type { FieldQuerySchema } from "~/user/field/server/schema/FieldQuerySchema";

export namespace fieldFetchFx {
	export interface Props extends FieldQuerySchema.Type {
		scope: FieldFilterSchema.Type;
	}
}

export const fieldFetchFx = Effect.fn("fieldFetchFx")(function* ({
	filter,
	where,
	scope,
	sort,
}: fieldFetchFx.Props) {
	const logger = yield* getLoggerFx("fieldFetchFx");
	logger.trace("fieldFetchFx", {
		filter,
		where,
		scope,
		sort,
	});

	return yield* withFetchFx({
		resource: "field",
		selectFx: withFieldSelectFx({
			sort,
		}),
		filter,
		where,
		scope,
	});
});

export type fieldFetchFx = ReturnType<typeof fieldFetchFx>;
