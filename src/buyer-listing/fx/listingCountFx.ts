import { Effect } from "effect";
import { sql } from "kysely";
import { withListingSelectFx } from "~/buyer-listing/db/withListingSelectFx";
import type { ListingCountQuerySchema } from "~/buyer-listing/schema/ListingCountQuerySchema";
import type { ListingWhereSchema } from "~/buyer-listing/schema/ListingWhereSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { withCountFx } from "~/database-query/fx/withCountFx";
import { hasExplicitCategory } from "~/listing/fn/hasExplicitCategory";
import { getLoggerFx } from "~/log/fx/getLoggerFx";

export namespace listingCountFx {
	export interface Props extends ListingCountQuerySchema.Type {
		userId: string;
		scope: ListingWhereSchema.Type;
	}
}

export const listingCountFx = Effect.fn("listingCountFx")(function* ({
	userId,
	where,
	scope,
	meta,
}: listingCountFx.Props) {
	const logger = yield* getLoggerFx("listingCountFx");
	logger.trace("listingCountFx", {
		userId,
		where,
		scope,
		meta,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;

			yield* Effect.promise(async () => {
				return sql`SET LOCAL work_mem = '32MB';`.execute(kysely);
			});

			return yield* withCountFx({
				selectFx: withListingSelectFx({
					userId,
					meta,
					hasExplicitCategory: hasExplicitCategory([
						where,
						scope,
					]),
				}),
				where,
				scope,
			});
		}),
	);
});

export type listingCountFx = ReturnType<typeof listingCountFx>;
