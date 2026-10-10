import { Effect } from "effect";
import { withCountFx } from "~/database-query/fx/withCountFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { withFieldOptionSelectFx } from "~/user-field-option/db/withFieldOptionSelectFx";
import type { FieldOptionCountQuerySchema } from "~/user-field-option/schema/FieldOptionCountQuerySchema";
import type { FieldOptionWhereSchema } from "~/user-field-option/schema/FieldOptionWhereSchema";

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
