import { Effect } from "effect";
import { withFetchFx } from "@/lib/common/fetch";
import { getLoggerFx } from "@/lib/common/log";
import { withFieldOptionSelectFx } from "~/user/field-option/server/db/withFieldOptionSelectFx";
import type { FieldOptionQuerySchema } from "~/user/field-option/server/schema/FieldOptionQuerySchema";
import type { FieldOptionWhereSchema } from "../schema/FieldOptionWhereSchema";

export namespace fieldOptionFetchFx {
	export interface Props extends FieldOptionQuerySchema.Type {
		scope: FieldOptionWhereSchema.Type;
	}
}

export const fieldOptionFetchFx = Effect.fn("fieldOptionFetchFx")(function* ({
	where,
	scope,
	sort,
}: fieldOptionFetchFx.Props) {
	const logger = yield* getLoggerFx("fieldOptionFetchFx");
	logger.trace("fieldOptionFetchFx", {
		where,
		scope,
		sort,
	});

	return yield* withFetchFx({
		resource: "fieldOption",
		selectFx: withFieldOptionSelectFx({
			sort,
		}),
		where,
		scope,
	});
});

export type fieldOptionFetchFx = ReturnType<typeof fieldOptionFetchFx>;
