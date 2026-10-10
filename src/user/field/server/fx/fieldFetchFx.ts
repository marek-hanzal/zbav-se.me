import { Effect } from "effect";
import { withFetchFx } from "~/http/fx/withFetchFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { withFieldSelectFx } from "~/user/field/server/db/withFieldSelectFx";
import type { FieldQuerySchema } from "~/user/field/server/schema/FieldQuerySchema";
import type { FieldWhereSchema } from "../schema/FieldWhereSchema";

export namespace fieldFetchFx {
	export interface Props extends FieldQuerySchema.Type {
		scope: FieldWhereSchema.Type;
	}
}

export const fieldFetchFx = Effect.fn("fieldFetchFx")(function* ({
	where,
	scope,
	sort,
}: fieldFetchFx.Props) {
	const logger = yield* getLoggerFx("fieldFetchFx");
	logger.trace("fieldFetchFx", {
		where,
		scope,
		sort,
	});

	return yield* withFetchFx({
		resource: "field",
		selectFx: withFieldSelectFx({
			sort,
		}),
		where,
		scope,
	});
});

export type fieldFetchFx = ReturnType<typeof fieldFetchFx>;
