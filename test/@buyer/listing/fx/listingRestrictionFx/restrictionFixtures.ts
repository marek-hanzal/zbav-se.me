import { Effect } from "effect";
import { DateServiceFx } from "~/date/service/DateServiceFx";
import { genIdFn } from "~/identity/fn/genIdFn";
import type { RestrictionEnumSchema } from "~/restriction/schema/RestrictionEnumSchema";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import type { testabaseFn } from "~/test/testabaseFn";

export type TestDatabase = Awaited<ReturnType<typeof testabaseFn>>;
export type Restriction = RestrictionEnumSchema.Type;

export const createRestrictedCategoryFx = (
	database: TestDatabase,
	props: {
		slug: string;
		restriction: Restriction;
	},
) =>
	Effect.promise(async () => {
		const category = {
			id: genIdFn(),
			group: "Buyer listing restriction fixture",
			category: `Buyer listing restriction ${props.slug}`,
			slug: props.slug,
			sort: 0,
			locale: "cs",
			discovery: "implicit" as const,
			restriction: props.restriction,
		};

		await database.kysely.insertInto("category").values(category).execute();

		return category;
	});

export const createUserRestrictionFx = (
	database: TestDatabase,
	props: {
		userId: string;
		restriction: Restriction;
		availableAtOffsetMinutes: number;
		expiresAtOffsetMinutes?: number;
		createdAtOffsetMinutes?: number;
	},
) =>
	Effect.gen(function* () {
		const dateContext = yield* DateServiceFx;
		const now = dateContext.nowFn();

		yield* Effect.promise(() =>
			database.kysely
				.insertInto("user_restriction")
				.values({
					id: genIdFn(),
					userId: props.userId,
					restriction: props.restriction,
					availableAt: now
						.plus({
							minutes: props.availableAtOffsetMinutes,
						})
						.toJSDate(),
					expiresAt:
						props.expiresAtOffsetMinutes === undefined
							? null
							: now
									.plus({
										minutes: props.expiresAtOffsetMinutes,
									})
									.toJSDate(),
					createdAt: now
						.plus({
							minutes: props.createdAtOffsetMinutes ?? props.availableAtOffsetMinutes,
						})
						.toJSDate(),
				})
				.execute(),
		);
	});

export const createRestrictionProbeListingsFx = (
	database: TestDatabase,
	props: {
		sellerId: string;
		title: string;
		slugPrefix: string;
	},
) =>
	Effect.gen(function* () {
		const noneCategory = yield* createRestrictedCategoryFx(database, {
			slug: `${props.slugPrefix}-none`,
			restriction: "none",
		});
		const adultCategory = yield* createRestrictedCategoryFx(database, {
			slug: `${props.slugPrefix}-adult`,
			restriction: "adult",
		});
		const restrictedCategory = yield* createRestrictedCategoryFx(database, {
			slug: `${props.slugPrefix}-restricted`,
			restriction: "restricted",
		});

		const noneListing = yield* createListingFx(props.sellerId, {
			title: props.title,
			categoryId: noneCategory.id,
		});
		const adultCategoryListing = yield* createListingFx(props.sellerId, {
			title: props.title,
			categoryId: adultCategory.id,
		});
		const restrictedCategoryListing = yield* createListingFx(props.sellerId, {
			title: props.title,
			categoryId: restrictedCategory.id,
		});
		const adultListingRestriction = yield* createListingFx(props.sellerId, {
			title: props.title,
			categoryId: noneCategory.id,
			restriction: "adult",
		});
		const restrictedListingRestriction = yield* createListingFx(props.sellerId, {
			title: props.title,
			categoryId: noneCategory.id,
			restriction: "restricted",
		});

		return {
			noneCategory,
			adultCategory,
			restrictedCategory,
			noneListing,
			adultCategoryListing,
			restrictedCategoryListing,
			adultListingRestriction,
			restrictedListingRestriction,
			categoryIdIn: [
				noneCategory.id,
				adultCategory.id,
				restrictedCategory.id,
			],
		} as const;
	});
