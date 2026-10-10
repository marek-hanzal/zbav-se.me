import { Effect } from "effect";
import { withCollectionFx } from "~/database-query/fx/withCollectionFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { withDraftSelectFx } from "~/seller-draft/db/withDraftSelectFx";
import type { DraftQuerySchema } from "~/seller-draft/schema/DraftQuerySchema";
import type { DraftWhereSchema } from "~/seller-draft/schema/DraftWhereSchema";

export namespace draftCollectionFx {
	export interface Props extends DraftQuerySchema.Type {
		userId: string;
		scope: DraftWhereSchema.Type;
	}
}

export const draftCollectionFx = Effect.fn("draftCollectionFx")(function* ({
	userId,
	cursor = {
		page: 0,
		size: 10,
	},
	where,
	scope,
	sort,
	limit,
}: draftCollectionFx.Props) {
	const logger = yield* getLoggerFx("draftCollectionFx");
	logger.trace("draftCollectionFx", {
		cursor,
		where,
		scope,
		sort,
		limit,
	});

	return yield* withCollectionFx({
		selectFx: withDraftSelectFx({
			userId,
			sort,
		}),
		cursor,
		where,
		scope,
		limit,
	});
});

export type draftCollectionFx = ReturnType<typeof draftCollectionFx>;
