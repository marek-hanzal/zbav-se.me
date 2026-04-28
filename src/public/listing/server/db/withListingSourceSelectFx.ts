import { Effect } from "effect";
import { match } from "ts-pattern";
import { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import type { ListingMetaSchema } from "~/public/listing/server/schema/ListingMetaSchema";
import type { ListingSortSchema } from "~/public/listing/server/schema/ListingSortSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";

const publicCategoryRestrictions = [
	RestrictionEnumSchema.enum.none,
	RestrictionEnumSchema.enum["adult-relaxed"],
] as const;

export namespace withListingSourceSelectFx {
	export interface Props {
		sort?: ListingSortSchema.Type[];
		meta: ListingMetaSchema.Type | undefined;
		hasExplicitCategory?: boolean;
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withListingSourceSelectFx>>;
}

export const withListingSourceSelectFx = Effect.fn("withListingSourceSelectFx")(function* ({
	sort,
	meta,
	hasExplicitCategory,
}: withListingSourceSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely
		.selectFrom("listing as l")
		.where("l.status", "in", [
			"live",
		] as const)
		.where((eb) =>
			eb.or([
				eb("l.withCategoryRestriction", "is", null),
				eb("l.withCategoryRestriction", "in", publicCategoryRestrictions),
			]),
		);
	// .where((eb) =>
	// 	eb.or([
	// 		eb("l.restriction", "is", null),
	// 		eb("l.restriction", "in", publicCategoryRestrictions),
	// 	]),
	// );

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
