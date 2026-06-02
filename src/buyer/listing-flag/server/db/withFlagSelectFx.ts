import { Effect } from "effect";
import { match } from "ts-pattern";
import { selectFx } from "@/lib/common/select";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import type { FlagSortSchema } from "../schema/FlagSortSchema";
import type { FlagWhereSchema } from "../schema/FlagWhereSchema";

export namespace withFlagSelectFx {
	export interface Props {
		sort?: FlagSortSchema.Type[];
	}
}

export const withFlagSelectFx = Effect.fn("withFlagSelectFx")(function* ({
	sort,
}: withFlagSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely.selectFrom("listing_flag as f");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("f.createdAt", item.order))
			.exhaustive();
	}

	return selectFx({
		select: query.select([
			"f.id",
			"f.listingId",
		]),
		queryFx(select, where: FlagWhereSchema.Type) {
			return Effect.gen(function* () {
				let q = select;

				if (!where) {
					return yield* Effect.succeed(select);
				}

				if (where.id) {
					q = q.where("f.id", "=", where.id);
				}

				if (where.idIn && where.idIn.length > 0) {
					q = q.where("f.id", "in", where.idIn);
				}

				if (where.userId) {
					q = q.where("f.userId", "=", where.userId);
				}

				if (where.listingId) {
					q = q.where("f.listingId", "=", where.listingId);
				}

				return yield* Effect.succeed(q);
			});
		},
	});
});
