import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { withFlagCollectionSelectFx } from "~/buyer/flag/server/db/withFlagCollectionSelectFx";
import { withFlagQueryBuilderFx } from "~/buyer/flag/server/db/withFlagQueryBuilderFx";
import type { FlagFilterSchema } from "~/buyer/flag/server/schema/FlagFilterSchema";
import type { FlagQuerySchema } from "~/buyer/flag/server/schema/FlagQuerySchema";

export namespace flagCollectionFx {
	export interface Props extends FlagQuerySchema.Type {
		scope: FlagFilterSchema.Type;
	}
}

export const flagCollectionFx = Effect.fn("flagCollectionFx")(function* ({
	cursor,
	filter,
	where,
	scope,
	sort,
}: flagCollectionFx.Props) {
	return yield* withCollectionFx({
		selectFx: withFlagCollectionSelectFx({
			sort,
		}),
		cursor: cursor ?? {
			page: 0,
			size: 10,
		},
		filter,
		where,
		scope,
		queryFx: withFlagQueryBuilderFx,
	});
});

export type flagCollectionFx = ReturnType<typeof flagCollectionFx>;
