import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withDraftQueryBuilderFx } from "~/@seller-user/draft/db/withDraftQueryBuilderFx";
import { withDraftSelectFx } from "~/@seller-user/draft/db/withDraftSelectFx";
import type { DraftFilterSchema } from "~/@seller-user/draft/schema/DraftFilterSchema";
import type { DraftQuerySchema } from "~/@seller-user/draft/schema/DraftQuerySchema";
import { withTraceFx } from "~/effect/withTraceFx";

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
	yield* withTraceFx({
		fx: "draftFetchFx",
		input: {
			filter,
			where,
			scope,
			sort,
		},
	});

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
