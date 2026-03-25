import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withInboxCollectionSelectFx } from "~/server/@user/inbox/db/withInboxCollectionSelectFx";
import { withInboxQueryBuilderFx } from "~/server/@user/inbox/db/withInboxQueryBuilderFx";
import type { InboxFilterSchema } from "~/server/@user/inbox/schema/InboxFilterSchema";
import type { InboxQuerySchema } from "~/server/@user/inbox/schema/InboxQuerySchema";

export namespace inboxCollectionFx {
	export interface Props extends InboxQuerySchema.Type {
		scope: InboxFilterSchema.Type;
	}
}

export const inboxCollectionFx = Effect.fn("inboxCollectionFx")(function* ({
	cursor,
	filter,
	where,
	scope,
	sort,
}: inboxCollectionFx.Props) {
	return yield* withCollectionFx({
		selectFx: withInboxCollectionSelectFx({
			sort,
		}),
		cursor: cursor ?? {
			page: 0,
			size: 30,
		},
		filter,
		where,
		scope,
		queryFx: withInboxQueryBuilderFx,
	});
});

export type inboxCollectionFx = ReturnType<typeof inboxCollectionFx>;
