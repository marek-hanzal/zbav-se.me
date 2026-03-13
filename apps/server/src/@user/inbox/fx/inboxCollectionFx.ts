import { Effect } from "effect";
import { withInboxCollectionSelectFx } from "~/@user/inbox/db/withInboxCollectionSelectFx";
import type { InboxFilterSchema } from "~/@user/inbox/schema/InboxFilterSchema";
import type { InboxQuerySchema } from "~/@user/inbox/schema/InboxQuerySchema";

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
	const select = yield* withInboxCollectionSelectFx({
		layers: [
			filter,
			where,
			scope,
		],
		sort,
	});
	const resolvedCursor = cursor ?? {
		page: 0,
		size: 30,
	};

	return yield* Effect.promise(async () => {
		return select
			.limit(resolvedCursor.size)
			.offset(resolvedCursor.page * resolvedCursor.size)
			.execute();
	});
});

export type inboxCollectionFx = ReturnType<typeof inboxCollectionFx>;
