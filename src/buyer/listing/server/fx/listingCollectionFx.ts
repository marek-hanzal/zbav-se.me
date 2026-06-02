import { Effect } from "effect";
import { sql } from "kysely";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import type { ListingQuerySchema } from "~/buyer/listing/server/schema/ListingQuerySchema";
import { hasExplicitCategory } from "~/common/listing/util/hasExplicitCategory";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { withListingSelectFx } from "../db/withListingSelectFx";
import type { ListingWhereSchema } from "../schema/ListingWhereSchema";

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
