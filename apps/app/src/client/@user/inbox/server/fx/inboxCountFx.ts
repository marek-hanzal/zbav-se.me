import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withInboxCollectionSelectFx } from "~/client/@user/inbox/server/db/withInboxCollectionSelectFx";
import { withInboxQueryBuilderFx } from "~/client/@user/inbox/server/db/withInboxQueryBuilderFx";
import type { InboxCountQuerySchema } from "~/client/@user/inbox/server/schema/InboxCountQuerySchema";
import type { InboxFilterSchema } from "~/client/@user/inbox/server/schema/InboxFilterSchema";

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
	return yield* withCountFx({
		selectFx: withInboxCollectionSelectFx({}),
		filter,
		where,
		scope,
		queryFx: withInboxQueryBuilderFx,
	});
});

export type inboxCountFx = ReturnType<typeof inboxCountFx>;
