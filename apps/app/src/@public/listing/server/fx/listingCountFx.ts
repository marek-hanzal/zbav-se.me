import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withListingCollectionSelectFx } from "~/@public/listing/server/db/withListingCollectionSelectFx";
import { withListingQueryBuilderFx } from "~/@public/listing/server/db/withListingQueryBuilderFx";
import type { ListingCountQuerySchema } from "~/@public/listing/server/schema/ListingCountQuerySchema";
import type { ListingFilterSchema } from "~/@public/listing/server/schema/ListingFilterSchema";
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
	meta,
}: listingCountFx.Props) {
	const hasFilter = !!(filter && Object.keys(filter).length > 0);
	const hasWhere = !!(where && Object.keys(where).length > 0);
	const hasScope = !!(scope && Object.keys(scope).length > 0);
	const hasMeta = !!(meta && Object.keys(meta).length > 0);

	if (!hasFilter && !hasWhere && !hasScope && !hasMeta) {
		const { kysely } = yield* KyselyContextFx;

		const { count } = yield* Effect.promise(async () => {
			return kysely
				.selectFrom("listing as l")
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
		selectFx: withListingCollectionSelectFx({
			meta,
		}),
		filter,
		where,
		scope,
		queryFx(query) {
			return withListingQueryBuilderFx({
				...query,
				meta,
			});
		},
	});
});

export type listingCountFx = ReturnType<typeof listingCountFx>;
