import { Effect } from "effect";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { match } from "ts-pattern";
import { selectFx } from "@/lib/common/select";
import type { ListingQuerySchema } from "~/buyer/listing/server/schema/ListingQuerySchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import type { FeedFilterSchema } from "../schema/FeedFilterSchema";
import type { FeedSortSchema } from "../schema/FeedSortSchema";

export namespace withFeedSelectFx {
	export interface Props {
		sort?: FeedSortSchema.Type[];
	}
}

export const withFeedSelectFx = Effect.fn("withFeedSelectFx")(function* ({
	sort,
}: withFeedSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely.selectFrom("feed as f");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("f.createdAt", item.order))
			.with("updatedAt", () => query.orderBy("f.updatedAt", item.order))
			.exhaustive();
	}

	return selectFx({
		select: query
			.select([
				"f.id",
				"f.userId",
				"f.uploadId",
				"f.type",
				"f.name",
				"f.createdAt",
				"f.updatedAt",
			])
			.select((eb) => eb.ref("f.query").$castTo<ListingQuerySchema.Type>().as("query"))
			.select((eb) =>
				jsonObjectFrom(
					eb
						.selectFrom("upload as u")
						.selectAll()
						.whereRef("u.id", "=", "f.uploadId")
						.limit(1),
				).as("upload"),
			),
		queryFx(select, where: FeedFilterSchema.Type) {
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

				if (where.type) {
					q = q.where("f.type", "=", where.type);
				}

				return yield* Effect.succeed(q);
			});
		},
	});
});
