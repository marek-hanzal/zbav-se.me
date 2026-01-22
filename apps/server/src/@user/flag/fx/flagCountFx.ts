import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withFlagCollectionSelectFx } from "~/@user/flag/db/withFlagCollectionSelectFx";
import { withFlagQueryBuilderFx } from "~/@user/flag/db/withFlagQueryBuilderFx";
import type { FlagCountQuerySchema } from "~/@user/flag/schema/FlagCountQuerySchema";
import type { FlagFilterSchema } from "~/@user/flag/schema/FlagFilterSchema";

export namespace flagCountFx {
	export interface Props extends FlagCountQuerySchema.Type {
		scope: FlagFilterSchema.Type;
	}
}

export const flagCountFx = Effect.fn("flagCountFx")(function* ({
	filter,
	where,
	scope,
	count,
}: flagCountFx.Props) {
	return yield* withCountFx({
		selectFx: withFlagCollectionSelectFx({}),
		filter,
		where,
		scope,
		count,
		queryFx: withFlagQueryBuilderFx,
	});
});

export type flagCountFx = ReturnType<typeof flagCountFx>;
