import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withDraftCollectionSelectFx } from "~/server/@seller/draft/db/withDraftCollectionSelectFx";
import { withDraftQueryBuilderFx } from "~/server/@seller/draft/db/withDraftQueryBuilderFx";
import type { DraftCountQuerySchema } from "~/server/@seller/draft/schema/DraftCountQuerySchema";
import type { DraftFilterSchema } from "~/server/@seller/draft/schema/DraftFilterSchema";

export namespace draftCountFx {
	export interface Props extends DraftCountQuerySchema.Type {
		scope: DraftFilterSchema.Type;
	}
}

export const draftCountFx = Effect.fn("draftCountFx")(function* ({
	filter,
	where,
	scope,
}: draftCountFx.Props) {
	return yield* withCountFx({
		selectFx: withDraftCollectionSelectFx({}),
		filter,
		where,
		scope,
		queryFx: withDraftQueryBuilderFx,
	});
});

export type draftCountFx = ReturnType<typeof draftCountFx>;
