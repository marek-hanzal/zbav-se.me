import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import type { DraftCountQuerySchema } from "~/seller/draft/server/schema/DraftCountQuerySchema";
import { withDraftSelectFx } from "../db/withDraftSelectFx";
import type { DraftWhereSchema } from "../schema/DraftWhereSchema";

export namespace draftCountFx {
	export interface Props extends DraftCountQuerySchema.Type {
		userId: string;
		scope: DraftWhereSchema.Type;
	}
}

export const draftCountFx = Effect.fn("draftCountFx")(function* ({
	userId,
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
		selectFx: withDraftSelectFx({
			userId,
			sort: [],
		}),
		filter,
		where,
		scope,
	});
});

export type draftCountFx = ReturnType<typeof draftCountFx>;
