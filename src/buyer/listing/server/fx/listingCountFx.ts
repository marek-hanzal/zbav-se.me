import { Effect } from "effect";
import { sql } from "kysely";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { withListingCollectionSelectFx } from "~/buyer/listing/server/db/withListingCollectionSelectFx";
import { withListingQueryBuilderFx } from "~/buyer/listing/server/db/withListingQueryBuilderFx";
import type { ListingCountQuerySchema } from "~/buyer/listing/server/schema/ListingCountQuerySchema";
import type { ListingFilterSchema } from "~/buyer/listing/server/schema/ListingFilterSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";

export namespace listingCountFx {
	export interface Props extends ListingCountQuerySchema.Type {
		userId: string;
		scope: ListingFilterSchema.Type;
	}
}

export const listingCountFx = Effect.fn("listingCountFx")(function* ({
	userId,
	filter,
	where,
	scope,
	meta,
}: listingCountFx.Props) {
	const logger = yield* getLoggerFx("listingCountFx");
	logger.debug("listingCountFx", {
		userId,
		filter,
		where,
		scope,
		meta,
	});

	const hasFilter = !!(filter && Object.keys(filter).length > 0);
	const hasWhere = !!(where && Object.keys(where).length > 0);
	const hasScope = !!(scope && Object.keys(scope).length > 0);
	const hasMeta = !!(meta && Object.keys(meta).length > 0);

	/**
	 * Fast path for empty count payload (e.g. {}) to avoid counting over join-heavy listing selects.
	 */
	if (!hasFilter && !hasWhere && !hasScope && !hasMeta) {
		const { kysely } = yield* KyselyContextFx;

		const { count } = yield* Effect.promise(async () => {
			return kysely
				.selectFrom("listing as l")
				.select(sql<number>`count(*)::int`.as("count"))
				.executeTakeFirstOrThrow();
		});

		return {
			total: count,
			filter: count,
			where: count,
			isEmpty: count === 0,
			isFilterEmpty: false,
		};
	}

	return yield* withCountFx({
		selectFx: withListingCollectionSelectFx({
			userId,
			meta,
		}),
		filter,
		where,
		scope,
		queryFx(query) {
			return withListingQueryBuilderFx({
				...query,
				userId,
				meta,
			});
		},
	});
});

export type listingCountFx = ReturnType<typeof listingCountFx>;
