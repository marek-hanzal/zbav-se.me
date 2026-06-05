import { Effect } from "effect";
import { sql } from "kysely";
import type { DateTime } from "luxon";
import { DateServiceFx } from "@/lib/common/date";
import { withListingSelectFx } from "~/public/listing/server/db/withListingSelectFx";

export namespace withListingBucketsFx {
	export interface Props {
		now?: DateTime;
		day?: string;
	}
}

export const withListingBucketsFx = Effect.fn("withListingBucketsFx")(function* ({
	now,
	day,
}: withListingBucketsFx.Props) {
	const dateContext = yield* DateServiceFx;
	const currentNow = now ?? dateContext.now();
	const limit = 50_000;
	const daySql = sql<string>`to_char(date_trunc('day', timezone('UTC', ${sql.ref("l.visibleAt")})), 'YYYY-MM-DD')`;
	const { select, queryFx } = yield* withListingSelectFx({
		hasExplicitCategory: false,
	});
	const currentSelect = yield* queryFx(select, {
		visibleAtLte: currentNow.toJSDate(),
		expiresAtAfter: currentNow.toJSDate(),
	});

	return yield* Effect.promise(async () => {
		let query = currentSelect
			.clearSelect()
			.clearOrderBy()
			.clearLimit()
			.clearOffset()
			.select(daySql.as("day"));

		if (day) {
			query = query.where(daySql, "=", day);
		}

		return query
			.select(sql<number>`count(*)::int`.as("count"))
			.select(sql<number>`ceil(count(*)::numeric / ${limit})::int`.as("pages"))
			.select(sql<Date>`max(${sql.ref("l.updatedAt")})`.as("lastmod"))
			.groupBy(daySql)
			.orderBy(daySql, "desc")
			.execute();
	});
});
