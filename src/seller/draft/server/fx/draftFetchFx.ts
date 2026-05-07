import { Effect } from "effect";
import { withFetchFx } from "@/lib/common/fetch";
import { getLoggerFx } from "@/lib/common/log";
import { withDraftSelectFx } from "~/seller/draft/server/db/withDraftSelectFx";
import type { DraftQuerySchema } from "~/seller/draft/server/schema/DraftQuerySchema";
import type { DraftWhereSchema } from "../schema/DraftWhereSchema";

export namespace draftFetchFx {
	export interface Props extends DraftQuerySchema.Type {
		userId: string;
		scope: DraftWhereSchema.Type;
	}
}

export const draftFetchFx = Effect.fn("draftFetchFx")(function* ({
	userId,
	filter,
	where,
	scope,
	sort,
}: draftFetchFx.Props) {
	const logger = yield* getLoggerFx("draftFetchFx");
	logger.trace("draftFetchFx", {
		filter,
		where,
		scope,
		sort,
	});

	return yield* withFetchFx({
		resource: "draft",
		selectFx: withDraftSelectFx({
			userId,
			sort,
		}),
		filter,
		where,
		scope,
	});
});

export type draftFetchFx = ReturnType<typeof draftFetchFx>;
