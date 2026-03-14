import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withDraftQueryBuilderFx } from "~/@seller/draft/db/withDraftQueryBuilderFx";
import { withDraftSelectFx } from "~/@seller/draft/db/withDraftSelectFx";
import type { DraftFilterSchema } from "~/@seller/draft/schema/DraftFilterSchema";
import type { DraftQuerySchema } from "~/@seller/draft/schema/DraftQuerySchema";

export namespace draftFetchFx {
	export interface Props extends DraftQuerySchema.Type {
		scope: DraftFilterSchema.Type;
	}
}

export const draftFetchFx = Effect.fn("draftFetchFx")(function* ({
	filter,
	where,
	scope,
	sort,
}: draftFetchFx.Props) {
	return yield* withFetchFx({
		resource: "draft",
		selectFx: withDraftSelectFx({
			sort,
		}),
		filter,
		where,
		scope,
		queryFx: withDraftQueryBuilderFx,
	});
});

export type draftFetchFx = ReturnType<typeof draftFetchFx>;
