import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withDraftCollectionSelectFx } from "~/@user/draft/db/withDraftCollectionSelectFx";
import { withDraftQueryBuilderFx } from "~/@user/draft/db/withDraftQueryBuilderFx";
import type { DraftCountQuerySchema } from "~/@user/draft/schema/DraftCountQuerySchema";
import type { DraftFilterSchema } from "~/@user/draft/schema/DraftFilterSchema";

export namespace draftCountFx {
	export interface Props extends DraftCountQuerySchema.Type {
		scope: DraftFilterSchema.Type;
	}
}

export const draftCountFx = Effect.fn("draftCountFx")(function* ({
	filter,
	where,
	scope,
	count,
}: draftCountFx.Props) {
	return yield* withCountFx({
		selectFx: withDraftCollectionSelectFx({}),
		filter,
		where,
		scope,
		count,
		queryFx: withDraftQueryBuilderFx,
	});
});

export type draftCountFx = ReturnType<typeof draftCountFx>;
