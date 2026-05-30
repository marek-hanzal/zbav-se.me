import { Effect } from "effect";
import { DateTime } from "luxon";
import { DateContextFx } from "@/lib/common/date";
import { withListingSelectFx } from "~/public/listing/server/db/withListingSelectFx";

export namespace withListingShardsFx {
	export interface Props {
		day: string;
		page: number;
		now?: DateTime;
	}
}

export const withListingShardsFx = Effect.fn("withListingShardsFx")(function* ({
	day,
	page,
	now,
}: withListingShardsFx.Props) {
	const dateContext = yield* DateContextFx;
	const currentNow = now ?? dateContext.now();
	const limit = 50_000;
	const offset = (page - 1) * limit;
	const dayStart = DateTime.fromISO(day, {
		zone: "utc",
	}).startOf("day");
	const dayEnd = dayStart.plus({
		days: 1,
	});
	const { select, queryFx } = yield* withListingSelectFx({
		hasExplicitCategory: false,
	});
	const currentSelect = yield* queryFx(select, {
		visibleAtLte: currentNow.toJSDate(),
		expiresAtAfter: currentNow.toJSDate(),
	});
	const scopedSelect = yield* queryFx(currentSelect, {
		visibleAtAfter: dayStart
			.minus({
				days: 1,
			})
			.endOf("day")
			.toJSDate(),
		visibleAtBefore: dayEnd.toJSDate(),
	});

	return yield* Effect.promise(async () => {
		return scopedSelect
			.clearSelect()
			.clearOrderBy()
			.select([
				"l.id",
				"l.updatedAt",
			])
			.orderBy("l.visibleAt", "desc")
			.orderBy("l.id", "desc")
			.limit(limit)
			.offset(offset)
			.execute();
	});
});
