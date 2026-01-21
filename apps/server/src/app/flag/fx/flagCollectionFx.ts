import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withFlagCollectionSelectFx } from "~/app/flag/db/withFlagCollectionSelectFx";
import { withFlagQueryBuilderFx } from "~/app/flag/db/withFlagQueryBuilderFx";
import type { FlagFilterSchema } from "~/app/flag/schema/FlagFilterSchema";
import type { FlagQuerySchema } from "~/app/flag/schema/FlagQuerySchema";

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
