import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withDraftCollectionSelectFx } from "~/client/@seller/draft/server/db/withDraftCollectionSelectFx";
import { withDraftQueryBuilderFx } from "~/client/@seller/draft/server/db/withDraftQueryBuilderFx";
import type { DraftFilterSchema } from "~/client/@seller/draft/server/schema/DraftFilterSchema";
import type { DraftQuerySchema } from "~/client/@seller/draft/server/schema/DraftQuerySchema";

export namespace draftCollectionFx {
	export interface Props extends DraftQuerySchema.Type {
		scope: DraftFilterSchema.Type;
	}
}

export const draftCollectionFx = Effect.fn("draftCollectionFx")(function* ({
	cursor,
	filter,
	where,
	scope,
	sort,
}: draftCollectionFx.Props) {
	return yield* withCollectionFx({
		selectFx: withDraftCollectionSelectFx({
			sort,
		}),
		cursor: cursor ?? {
			page: 0,
			size: 10,
		},
		filter,
		where,
		scope,
		queryFx: withDraftQueryBuilderFx,
	});
});

export type draftCollectionFx = ReturnType<typeof draftCollectionFx>;
