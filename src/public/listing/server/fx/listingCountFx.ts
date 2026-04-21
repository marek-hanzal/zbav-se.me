import { Effect } from "effect";
import { sql } from "kysely";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { hasExplicitCategory } from "~/common/listing/util/hasExplicitCategory";
import { withListingCollectionSelectFx } from "~/public/listing/server/db/withListingCollectionSelectFx";
import { withListingQueryBuilderFx } from "~/public/listing/server/db/withListingQueryBuilderFx";
import type { ListingCountQuerySchema } from "~/public/listing/server/schema/ListingCountQuerySchema";
import type { ListingFilterSchema } from "~/public/listing/server/schema/ListingFilterSchema";
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
	const logger = yield* getLoggerFx("listingCountFx");
	logger.trace("listingCountFx", {
		filter,
		where,
		scope,
		meta,
	});

	const hasFilter = !!(filter && Object.keys(filter).length > 0);
	const hasWhere = !!(where && Object.keys(where).length > 0);
	const hasScope = !!(scope && Object.keys(scope).length > 0);
	const hasMeta = !!(meta && Object.keys(meta).length > 0);

	if (!hasFilter && !hasWhere && !hasScope && !hasMeta) {
		const { kysely } = yield* KyselyContextFx;

		const { count } = yield* Effect.promise(async () => {
			return kysely
				.selectFrom("listing as l")
				.innerJoin("category as cat", "cat.id", "l.categoryId")
				.where("l.status", "in", [
					"live",
				])
				.where("cat.type", "=", "implicit")
				.select(sql<number>`count(*)::int`.as("count"))
				.executeTakeFirstOrThrow();
		});

		return count;
	}

	return yield* withCountFx({
		selectFx: withListingCollectionSelectFx({
			meta,
			hasExplicitCategory: hasExplicitCategory([
				filter,
				where,
				scope,
			]),
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
