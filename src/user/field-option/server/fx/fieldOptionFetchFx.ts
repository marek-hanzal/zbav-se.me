import { Effect } from "effect";
import { withFetchFx } from "@/lib/common/fetch";
import { getLoggerFx } from "@/lib/common/log";
import { withFieldOptionSelectFx } from "~/user/field-option/server/db/withFieldOptionSelectFx";
import type { FieldOptionFilterSchema } from "~/user/field-option/server/schema/FieldOptionFilterSchema";
import type { FieldOptionQuerySchema } from "~/user/field-option/server/schema/FieldOptionQuerySchema";

export namespace fieldOptionFetchFx {
	export interface Props extends FieldOptionQuerySchema.Type {
		scope: FieldOptionFilterSchema.Type;
	}
}

export const fieldOptionFetchFx = Effect.fn("fieldOptionFetchFx")(function* ({
	filter,
	where,
	scope,
	sort,
}: fieldOptionFetchFx.Props) {
	const logger = yield* getLoggerFx("fieldOptionFetchFx");
	logger.trace("fieldOptionFetchFx", {
		filter,
		where,
		scope,
		sort,
	});

	return yield* withFetchFx({
		resource: "fieldOption",
		selectFx: withFieldOptionSelectFx({
			sort,
		}),
		filter,
		where,
		scope,
	});
});

export type fieldOptionFetchFx = ReturnType<typeof fieldOptionFetchFx>;
