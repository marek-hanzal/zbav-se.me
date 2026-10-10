import { Effect } from "effect";
import { sql } from "kysely";
import { withListingSelectFx } from "~/buyer-listing/db/withListingSelectFx";
import type { ListingQuerySchema } from "~/buyer-listing/schema/ListingQuerySchema";
import type { ListingWhereSchema } from "~/buyer-listing/schema/ListingWhereSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { withCollectionFx } from "~/database-query/fx/withCollectionFx";
import { hasExplicitCategory } from "~/listing/fn/hasExplicitCategory";
import { getLoggerFx } from "~/log/fx/getLoggerFx";

export namespace listingCollectionFx {
	export interface Props extends ListingQuerySchema.Type {
		userId: string;
		scope: ListingWhereSchema.Type;
	}
}

export const listingCollectionFx = Effect.fn("listingCollectionFx")(function* ({
	userId,
	cursor = {
		page: 0,
		size: 10,
	},
	where,
	scope,
	sort,
	meta,
	limit,
}: listingCollectionFx.Props) {
	const logger = yield* getLoggerFx("listingCollectionFx");
	logger.trace("listingCollectionFx", {
		userId,
		cursor,
		where,
		scope,
		sort,
		meta,
		limit,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;

			yield* Effect.promise(async () => {
				return sql`SET LOCAL work_mem = '32MB';`.execute(kysely);
			});

			return yield* withCollectionFx({
				selectFx: withListingSelectFx({
					userId,
					sort,
					meta,
					hasExplicitCategory: hasExplicitCategory([
						where,
						scope,
					]),
				}),
				cursor,
				where,
				scope,
				limit,
			});
		}),
	);
});

export type listingCollectionFx = ReturnType<typeof listingCollectionFx>;
