import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withDraftCollectionSelectFx } from "~/seller/draft/server/db/withDraftCollectionSelectFx";
import { withDraftQueryBuilderFx } from "~/seller/draft/server/db/withDraftQueryBuilderFx";
import type { DraftFilterSchema } from "~/seller/draft/server/schema/DraftFilterSchema";
import type { DraftQuerySchema } from "~/seller/draft/server/schema/DraftQuerySchema";

export namespace draftCollectionFx {
	export interface Scope extends DraftFilterSchema.Type {
		userId: string;
	}

	export interface Props extends DraftQuerySchema.Type {
		scope: Scope;
	}
}

export const draftCollectionFx = Effect.fn("draftCollectionFx")(function* ({
	cursor = {
		page: 0,
		size: 10,
	},
	filter,
	where,
	scope,
	sort,
	limit,
}: draftCollectionFx.Props) {
	const logger = yield* getLoggerFx("draftCollectionFx");
	logger.trace("draftCollectionFx", {
		cursor,
		filter,
		where,
		scope,
		sort,
		limit,
	});

	return yield* withCollectionFx({
		selectFx: withDraftCollectionSelectFx({
			sort,
			userId: scope.userId,
		}),
		cursor,
		filter,
		where,
		scope,
		queryFx: withDraftQueryBuilderFx,
		limit,
	});
});

export type draftCollectionFx = ReturnType<typeof draftCollectionFx>;
