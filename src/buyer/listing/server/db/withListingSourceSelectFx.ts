import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import type { ListingMetaSchema } from "~/buyer/listing/server/schema/ListingMetaSchema";
import type { ListingSortSchema } from "~/buyer/listing/server/schema/ListingSortSchema";
import { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { withActiveUserRestrictionSelectFx } from "~/user/user-restriction/server/db/withActiveUserRestrictionSelectFx";

export namespace withListingSourceSelectFx {
	export interface Props {
		userId: string;
		sort?: ListingSortSchema.Type[];
		meta: ListingMetaSchema.Type | undefined;
		hasExplicitCategory?: boolean;
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withListingSourceSelectFx>>;
}

export const withListingSourceSelectFx = Effect.fn("withListingSourceSelectFx")(function* ({
	userId,
	sort,
	meta,
	hasExplicitCategory,
}: withListingSourceSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;
	const fallbackSql = sql`${RestrictionEnumSchema.enum.none}::restriction_enum`;
	const restrictionSql = yield* withActiveUserRestrictionSelectFx({
		userId,
	});

	let query = kysely
		.selectFrom("listing as l")
		.where("l.status", "in", [
			"live",
		] as const)
		.where((eb) => {
			return sql<boolean>`coalesce(${eb.ref("l.withCategoryRestriction")}, ${fallbackSql}) <= ${restrictionSql}`;
		});
	// .where((eb) => {
	// 	return sql<boolean>`coalesce(${eb.ref("l.restriction")}, ${fallbackSql}) <= ${restrictionSql}`;
	// });

	if (!hasExplicitCategory) {
		query = query.where("l.withCategoryDiscovery", "=", "implicit");
	}

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("l.createdAt", item.order))
			.with("updatedAt", () => query.orderBy("l.updatedAt", item.order))
			.with("expiresAt", () => query.orderBy("l.expiresAt", item.order))
			.exhaustive();
	}

	return query;
});
