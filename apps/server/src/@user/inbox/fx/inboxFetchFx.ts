import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withInboxQueryBuilderFx } from "~/@user/inbox/db/withInboxQueryBuilderFx";
import { withInboxSelectFx } from "~/@user/inbox/db/withInboxSelectFx";
import type { InboxFilterSchema } from "~/@user/inbox/schema/InboxFilterSchema";
import type { InboxQuerySchema } from "~/@user/inbox/schema/InboxQuerySchema";

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
