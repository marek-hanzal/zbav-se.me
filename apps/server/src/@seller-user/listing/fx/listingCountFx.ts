import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withListingCollectionSelectFx } from "~/@seller-user/listing/db/withListingCollectionSelectFx";
import { withListingQueryBuilderFx } from "~/@seller-user/listing/db/withListingQueryBuilderFx";
import type { ListingCountQuerySchema } from "~/@seller-user/listing/schema/ListingCountQuerySchema";
import type { ListingFilterSchema } from "~/@seller-user/listing/schema/ListingFilterSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTraceFx } from "~/effect/withTraceFx";

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
	yield* withTraceFx({
		fx: "listingCountFx",
		input: {
			filter,
			where,
			scope,
		},
	});

	const hasFilter = !!(filter && Object.keys(filter).length > 0);
	const hasWhere = !!(where && Object.keys(where).length > 0);

	/**
	 * Fast path for empty count payload (e.g. {}): avoid join-heavy listing select.
	 */
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
