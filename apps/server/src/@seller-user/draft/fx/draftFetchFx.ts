import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withDraftQueryBuilderFx } from "~/@seller-user/draft/db/withDraftQueryBuilderFx";
import { withDraftSelectFx } from "~/@seller-user/draft/db/withDraftSelectFx";
import type { DraftFilterSchema } from "~/@seller-user/draft/schema/DraftFilterSchema";
import type { DraftQuerySchema } from "~/@seller-user/draft/schema/DraftQuerySchema";

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
	yield* Effect.annotateLogsScoped({
		"draftFetchFx.filter": filter,
		"draftFetchFx.where": where,
		"draftFetchFx.scope": scope,
		"draftFetchFx.sort": sort,
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
