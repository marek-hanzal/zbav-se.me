import { Effect } from "effect";
import { withInboxCollectionSelectFx } from "~/@user/inbox/db/withInboxCollectionSelectFx";
import type { InboxCountQuerySchema } from "~/@user/inbox/schema/InboxCountQuerySchema";
import type { InboxFilterSchema } from "~/@user/inbox/schema/InboxFilterSchema";

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
	const totalSelect = yield* withInboxCollectionSelectFx({
		layers: [
			scope,
		],
	});
	const whereSelect = yield* withInboxCollectionSelectFx({
		layers: [
			where,
			scope,
		],
	});
	const filterSelect = yield* withInboxCollectionSelectFx({
		layers: [
			filter,
			where,
			scope,
		],
	});

	const countTotal = yield* Effect.promise(async () => {
		return totalSelect
			.clearSelect()
			.select((eb) => eb.fn.countAll<number>().as("count"))
			.executeTakeFirstOrThrow();
	});

	const countWhere = yield* Effect.promise(async () => {
		return whereSelect
			.clearSelect()
			.select((eb) => eb.fn.countAll<number>().as("count"))
			.executeTakeFirstOrThrow();
	});

	const countFilter = yield* Effect.promise(async () => {
		return filterSelect
			.clearSelect()
			.select((eb) => eb.fn.countAll<number>().as("count"))
			.executeTakeFirstOrThrow();
	});

	const total = Number(countTotal.count);
	const filterCount = Number(countFilter.count);
	const whereCount = Number(countWhere.count);

	return {
		total,
		filter: filterCount,
		where: whereCount,
		isEmpty: total === 0,
		isFilterEmpty: filterCount === 0 && total > 0,
	};
});

export type inboxCountFx = ReturnType<typeof inboxCountFx>;
