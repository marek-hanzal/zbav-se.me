import { withCountFx } from "@use-pico/common/count";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { withDraftCollectionSelectFx } from "~/app/draft/db/withDraftCollectionSelectFx";
import { withDraftQueryBuilderFx } from "~/app/draft/db/withDraftQueryBuilderFx";
import type { DraftCountQuerySchema } from "~/app/draft/schema/DraftCountQuerySchema";
import type { DraftFilterSchema } from "~/app/draft/schema/DraftFilterSchema";

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
