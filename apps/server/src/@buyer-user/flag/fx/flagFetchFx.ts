import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withFlagQueryBuilderFx } from "~/@buyer-user/flag/db/withFlagQueryBuilderFx";
import { withFlagSelectFx } from "~/@buyer-user/flag/db/withFlagSelectFx";
import type { FlagFilterSchema } from "~/@buyer-user/flag/schema/FlagFilterSchema";
import type { FlagQuerySchema } from "~/@buyer-user/flag/schema/FlagQuerySchema";

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
