import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withFlagQueryBuilderFx } from "~/client/@buyer/flag/server/db/withFlagQueryBuilderFx";
import { withFlagSelectFx } from "~/client/@buyer/flag/server/db/withFlagSelectFx";
import type { FlagFilterSchema } from "~/client/@buyer/flag/server/schema/FlagFilterSchema";
import type { FlagQuerySchema } from "~/client/@buyer/flag/server/schema/FlagQuerySchema";

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
