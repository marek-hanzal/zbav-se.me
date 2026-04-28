import { Effect } from "effect";
import { match } from "ts-pattern";
import { selectFx } from "@/lib/common/select";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import type { ListingFilterSchema } from "../schema/ListingFilterSchema";
import type { ListingSortSchema } from "../schema/ListingSortSchema";

export namespace withListingSelectFx {
	export interface Props {
		sort?: ListingSortSchema.Type[];
	}

	export type Select = ReturnType<typeof withListingSelectFx>;
}

export const withListingSelectFx = Effect.fn("withListingSelectFx")(function* ({
	sort,
}: withListingSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely.selectFrom("listing as l");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("l.createdAt", item.order))
			.with("updatedAt", () => query.orderBy("l.updatedAt", item.order))
			.with("expiresAt", () => query.orderBy("l.expiresAt", item.order))
			.exhaustive();
	}

	return selectFx({
		select: query.select([
			"l.id",
			"l.status",
			"l.withUploadIds",
			"l.categoryId",
			"l.restriction",
			"l.withImageUrl",
			"l.expiresAt",
			"l.createdAt",
			"l.updatedAt",
		]),
		queryFx(select, where: ListingFilterSchema.Type) {
			return Effect.gen(function* () {
				let query = select;

				if (!where) {
					return yield* Effect.succeed(select);
				}

				if (where.id) {
					query = query.where("l.id", "=", where.id);
				}

				if (where.idIn && where.idIn.length > 0) {
					query = query.where("l.id", "in", where.idIn);
				}

				if (where.fulltext) {
					const fulltext = where.fulltext;

					// query = query.where((eb) => {
					// 	const categoryIdSelect = eb
					// 		.selectFrom("category as cat")
					// 		.select("cat.id")
					// 		.where((eb) =>
					// 			eb.or([
					// 				withLikeEx(eb.ref("cat.category"), fulltext),
					// 				withLikeEx(eb.ref("cat.group"), fulltext),
					// 			]),
					// 		);

					// 	return eb.or([
					// 		withNormalizedLikeEx(eb.ref("l.withTitleSearch"), fulltext, "both"),
					// 		eb("l.categoryId", "in", categoryIdSelect),
					// 	]);
					// }) as TSelect;
				}

				if (where.userId) {
					query = query.where("l.userId", "=", where.userId);
				}

				return yield* Effect.succeed(query);
			});
		},
	});
});
