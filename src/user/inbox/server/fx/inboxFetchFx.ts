import { Effect } from "effect";
import { withFetchFx } from "@/lib/common/fetch";
import { getLoggerFx } from "@/lib/common/log";
import { withInboxQueryBuilderFx } from "~/user/inbox/server/db/withInboxQueryBuilderFx";
import { withInboxSelectFx } from "~/user/inbox/server/db/withInboxSelectFx";
import type { InboxFilterSchema } from "~/user/inbox/server/schema/InboxFilterSchema";
import type { InboxQuerySchema } from "~/user/inbox/server/schema/InboxQuerySchema";

export namespace inboxFetchFx {
	export interface Props extends InboxQuerySchema.Type {
		scope: InboxFilterSchema.Type;
	}
}

export const inboxFetchFx = Effect.fn("inboxFetchFx")(function* ({
	filter,
	where,
	scope,
	sort,
}: inboxFetchFx.Props) {
	const logger = yield* getLoggerFx("inboxFetchFx");
	logger.debug("inboxFetchFx", {
		filter,
		where,
		scope,
		sort,
	});

	return yield* withFetchFx({
		resource: "inbox",
		selectFx: withInboxSelectFx({
			sort,
		}),
		filter,
		where,
		scope,
		queryFx: withInboxQueryBuilderFx,
	});
});

export type inboxFetchFx = ReturnType<typeof inboxFetchFx>;
