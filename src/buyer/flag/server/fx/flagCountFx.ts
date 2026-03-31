import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { withFlagCollectionSelectFx } from "~/buyer/flag/server/db/withFlagCollectionSelectFx";
import { withFlagQueryBuilderFx } from "~/buyer/flag/server/db/withFlagQueryBuilderFx";
import type { FlagCountQuerySchema } from "~/buyer/flag/server/schema/FlagCountQuerySchema";
import type { FlagFilterSchema } from "~/buyer/flag/server/schema/FlagFilterSchema";

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
		selectFx: withFlagCollectionSelectFx({}),
		filter,
		where,
		scope,
		queryFx: withFlagQueryBuilderFx,
	});
});

export type flagCountFx = ReturnType<typeof flagCountFx>;
