import { Effect } from "effect";
import { withCountFx } from "~/database-query/fx/withCountFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { withFieldSelectFx } from "~/user-field/db/withFieldSelectFx";
import type { FieldCountQuerySchema } from "~/user-field/schema/FieldCountQuerySchema";
import type { FieldWhereSchema } from "~/user-field/schema/FieldWhereSchema";

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
