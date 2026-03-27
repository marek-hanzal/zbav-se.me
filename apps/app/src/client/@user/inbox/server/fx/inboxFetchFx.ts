import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withInboxQueryBuilderFx } from "~/client/@user/inbox/server/db/withInboxQueryBuilderFx";
import { withInboxSelectFx } from "~/client/@user/inbox/server/db/withInboxSelectFx";
import type { InboxFilterSchema } from "~/client/@user/inbox/server/schema/InboxFilterSchema";
import type { InboxQuerySchema } from "~/client/@user/inbox/server/schema/InboxQuerySchema";

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
