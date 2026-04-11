import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { withInboxCollectionSelectFx } from "~/user/inbox/server/db/withInboxCollectionSelectFx";
import { withInboxQueryBuilderFx } from "~/user/inbox/server/db/withInboxQueryBuilderFx";
import type { InboxCountQuerySchema } from "~/user/inbox/server/schema/InboxCountQuerySchema";
import type { InboxFilterSchema } from "~/user/inbox/server/schema/InboxFilterSchema";

export namespace inboxCountFx {
	export interface Props extends InboxCountQuerySchema.Type {
		scope: InboxFilterSchema.Type;
	}
}

export const inboxCountFx = Effect.fn("inboxCountFx")(function* ({
	filter,
	where,
	scope,
}: inboxCountFx.Props) {
	const logger = yield* getLoggerFx("inboxCountFx");
	logger.trace("inboxCountFx", {
		filter,
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withInboxCollectionSelectFx({}),
		filter,
		where,
		scope,
		queryFx: withInboxQueryBuilderFx,
	});
});

export type inboxCountFx = ReturnType<typeof inboxCountFx>;
