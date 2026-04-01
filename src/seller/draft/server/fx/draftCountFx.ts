import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { withDraftCollectionSelectFx } from "~/seller/draft/server/db/withDraftCollectionSelectFx";
import { withDraftQueryBuilderFx } from "~/seller/draft/server/db/withDraftQueryBuilderFx";
import type { DraftCountQuerySchema } from "~/seller/draft/server/schema/DraftCountQuerySchema";
import type { DraftFilterSchema } from "~/seller/draft/server/schema/DraftFilterSchema";

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
	const logger = yield* getLoggerFx("draftCountFx");
	logger.debug("draftCountFx", {
		filter,
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withDraftCollectionSelectFx({}),
		filter,
		where,
		scope,
		queryFx: withDraftQueryBuilderFx,
	});
});

export type draftCountFx = ReturnType<typeof draftCountFx>;
