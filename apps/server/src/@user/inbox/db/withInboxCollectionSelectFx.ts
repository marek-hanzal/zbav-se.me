import { Effect } from "effect";
import { withInboxSelectFx } from "~/@user/inbox/db/withInboxSelectFx";
import type { InboxSortSchema } from "~/@user/inbox/schema/InboxSortSchema";

export namespace withInboxCollectionSelectFx {
	export interface Props {
		sort?: InboxSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withInboxCollectionSelectFx>>;
}

export const withInboxCollectionSelectFx = Effect.fn("withInboxCollectionSelectFx")(function* ({
	sort,
}: withInboxCollectionSelectFx.Props) {
	return yield* withInboxSelectFx({
		sort,
	});
});
