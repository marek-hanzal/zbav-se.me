import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { withDraftCollectionSelectFx } from "~/seller/draft/server/db/withDraftCollectionSelectFx";
import { withDraftQueryBuilderFx } from "~/seller/draft/server/db/withDraftQueryBuilderFx";
import type { DraftCountQuerySchema } from "~/seller/draft/server/schema/DraftCountQuerySchema";
import type { DraftFilterSchema } from "~/seller/draft/server/schema/DraftFilterSchema";

export namespace draftCountFx {
	export interface Scope extends DraftFilterSchema.Type {
		userId: string;
	}

	export interface Props extends DraftCountQuerySchema.Type {
		scope: Scope;
	}
}

export const draftCountFx = Effect.fn("draftCountFx")(function* ({
	filter,
	where,
	scope,
}: draftCountFx.Props) {
	const logger = yield* getLoggerFx("draftCountFx");
	logger.trace("draftCountFx", {
		filter,
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withDraftCollectionSelectFx({
			userId: scope.userId,
		}),
		filter,
		where,
		scope,
		queryFx: withDraftQueryBuilderFx,
	});
});

export type draftCountFx = ReturnType<typeof draftCountFx>;
