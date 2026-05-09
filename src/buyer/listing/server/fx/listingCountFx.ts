import { Effect } from "effect";
import { sql } from "kysely";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import type { ListingCountQuerySchema } from "~/buyer/listing/server/schema/ListingCountQuerySchema";
import { hasExplicitCategory } from "~/common/listing/util/hasExplicitCategory";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { withListingSelectFx } from "../db/withListingSelectFx";
import type { ListingWhereSchema } from "../schema/ListingWhereSchema";

export namespace listingCountFx {
	export interface Props extends ListingCountQuerySchema.Type {
		userId: string;
		scope: ListingWhereSchema.Type;
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
	logger.trace("listingCountFx", {
		userId,
		filter,
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
						filter,
						where,
						scope,
					]),
				}),
				filter,
				where,
				scope,
			});
		}),
	);
});

export type listingCountFx = ReturnType<typeof listingCountFx>;
