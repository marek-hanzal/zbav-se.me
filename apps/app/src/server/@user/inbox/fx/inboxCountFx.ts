import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withInboxCollectionSelectFx } from "~/server/@user/inbox/db/withInboxCollectionSelectFx";
import { withInboxQueryBuilderFx } from "~/server/@user/inbox/db/withInboxQueryBuilderFx";
import type { InboxCountQuerySchema } from "~/server/@user/inbox/schema/InboxCountQuerySchema";
import type { InboxFilterSchema } from "~/server/@user/inbox/schema/InboxFilterSchema";

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
