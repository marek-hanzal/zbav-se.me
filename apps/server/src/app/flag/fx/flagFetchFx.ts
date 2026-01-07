import { withFetchFx } from "@use-pico/common/fetch";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { withFlagQueryBuilderFx } from "~/app/flag/db/withFlagQueryBuilderFx";
import { withFlagSelectFx } from "~/app/flag/db/withFlagSelectFx";
import type { FlagFilterSchema } from "~/app/flag/schema/FlagFilterSchema";
import type { FlagQuerySchema } from "~/app/flag/schema/FlagQuerySchema";

export namespace flagFetchFx {
	export interface Props extends FlagQuerySchema.Type {
		scope: FlagFilterSchema.Type;
	}
}

export const flagFetchFx = Effect.fn("flagFetchFx")(function* ({
	filter,
	where,
	sort,
	scope,
}: flagFetchFx.Props) {
	return yield* withFetchFx({
		resource: "flag",
		selectFx: withFlagSelectFx({
			sort,
		}),
		filter,
		where,
		scope,
		queryFx: withFlagQueryBuilderFx,
	});
});

export type flagFetchFx = ReturnType<typeof flagFetchFx>;

