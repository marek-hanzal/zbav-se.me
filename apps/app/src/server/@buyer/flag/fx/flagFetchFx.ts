import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withFlagQueryBuilderFx } from "~/server/@buyer/flag/db/withFlagQueryBuilderFx";
import { withFlagSelectFx } from "~/server/@buyer/flag/db/withFlagSelectFx";
import type { FlagFilterSchema } from "~/server/@buyer/flag/schema/FlagFilterSchema";
import type { FlagQuerySchema } from "~/server/@buyer/flag/schema/FlagQuerySchema";

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
