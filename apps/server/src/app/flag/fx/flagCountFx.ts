import { withCountFx } from "@use-pico/common/count";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { withFlagQueryBuilderFx } from "~/app/flag/db/withFlagQueryBuilderFx";
import { withFlagSelectFx } from "~/app/flag/db/withFlagSelectFx";
import type { FlagCountQuerySchema } from "~/app/flag/schema/FlagCountQuerySchema";
import type { FlagFilterSchema } from "~/app/flag/schema/FlagFilterSchema";

export namespace flagCountFx {
	export interface Props extends FlagCountQuerySchema.Type {
		scope: FlagFilterSchema.Type;
	}
}

export const flagCountFx = Effect.fn("flagCountFx")(function* ({
	filter,
	where,
	scope,
}: flagCountFx.Props) {
	return yield* withCountFx({
		selectFx: withFlagSelectFx({}),
		filter,
		where,
		scope,
		queryFx: withFlagQueryBuilderFx,
	});
});

export type flagCountFx = ReturnType<typeof flagCountFx>;

