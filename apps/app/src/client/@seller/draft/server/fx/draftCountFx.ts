import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withDraftCollectionSelectFx } from "~/client/@seller/draft/server/db/withDraftCollectionSelectFx";
import { withDraftQueryBuilderFx } from "~/client/@seller/draft/server/db/withDraftQueryBuilderFx";
import type { DraftCountQuerySchema } from "~/client/@seller/draft/server/schema/DraftCountQuerySchema";
import type { DraftFilterSchema } from "~/client/@seller/draft/server/schema/DraftFilterSchema";

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
