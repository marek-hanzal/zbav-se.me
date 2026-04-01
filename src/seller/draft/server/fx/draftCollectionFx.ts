import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withDraftCollectionSelectFx } from "~/seller/draft/server/db/withDraftCollectionSelectFx";
import { withDraftQueryBuilderFx } from "~/seller/draft/server/db/withDraftQueryBuilderFx";
import type { DraftFilterSchema } from "~/seller/draft/server/schema/DraftFilterSchema";
import type { DraftQuerySchema } from "~/seller/draft/server/schema/DraftQuerySchema";

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
	const logger = yield* getLoggerFx("draftCollectionFx");
	logger.debug("draftCollectionFx", {
		cursor,
		filter,
		where,
		scope,
		sort,
	});

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
