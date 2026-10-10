import { Effect } from "effect";
import { match } from "ts-pattern";
import type { IgnoreSortSchema } from "~/buyer-listing-ignore/schema/IgnoreSortSchema";
import type { IgnoreWhereSchema } from "~/buyer-listing-ignore/schema/IgnoreWhereSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { selectFn } from "~/database-query/fn/selectFn";

export namespace withIgnoreSelectFx {
	export interface Props {
		sort?: IgnoreSortSchema.Type[];
	}
}

export const withIgnoreSelectFx = Effect.fn("withIgnoreSelectFx")(function* ({
	sort,
}: withIgnoreSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely.selectFrom("listing_ignore as i");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("i.createdAt", item.order))
			.exhaustive();
	}

	return selectFn({
		select: query.select([
			"i.id",
			"i.listingId",
		]),
		queryFx(select, where: IgnoreWhereSchema.Type) {
			return Effect.gen(function* () {
				let query = select;

				if (!where) {
					return yield* Effect.succeed(select);
				}

				if (where.id) {
					query = query.where("i.id", "=", where.id);
				}

				if (where.idIn && where.idIn.length > 0) {
					query = query.where("i.id", "in", where.idIn);
				}

				if (where.userId) {
					query = query.where("i.userId", "=", where.userId);
				}

				if (where.listingId) {
					query = query.where("i.listingId", "=", where.listingId);
				}

				return yield* Effect.succeed(query);
			});
		},
	});
});
