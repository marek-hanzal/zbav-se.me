import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withListingCollectionSelectFx } from "~/@seller/listing/server/db/withListingCollectionSelectFx";
import { withListingQueryBuilderFx } from "~/@seller/listing/server/db/withListingQueryBuilderFx";
import type { ListingCountQuerySchema } from "~/@seller/listing/server/schema/ListingCountQuerySchema";
import type { ListingFilterSchema } from "~/@seller/listing/server/schema/ListingFilterSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";

export namespace listingCountFx {
	export interface Props extends ListingCountQuerySchema.Type {
		scope: ListingFilterSchema.Type;
	}
}

export const listingCountFx = Effect.fn("listingCountFx")(function* ({
	filter,
	where,
	scope,
}: listingCountFx.Props) {
	const hasFilter = !!(filter && Object.keys(filter).length > 0);
	const hasWhere = !!(where && Object.keys(where).length > 0);

	if (!hasFilter && !hasWhere) {
		const { kysely } = yield* KyselyContextFx;

		let query = kysely.selectFrom("listing as l");
		if (scope?.userId) {
			query = query.where("l.userId", "=", scope.userId);
		}

		const { count } = yield* Effect.promise(async () => {
			return query
				.select((eb) => eb.fn.countAll<number>().as("count"))
				.executeTakeFirstOrThrow();
		});

		const total = Number(count);

		return {
			total,
			filter: total,
			where: total,
			isEmpty: total === 0,
			isFilterEmpty: false,
		};
	}

	return yield* withCountFx({
		selectFx: withListingCollectionSelectFx({}),
		filter,
		where,
		scope,
		queryFx: withListingQueryBuilderFx,
	});
});

export type listingCountFx = ReturnType<typeof listingCountFx>;
