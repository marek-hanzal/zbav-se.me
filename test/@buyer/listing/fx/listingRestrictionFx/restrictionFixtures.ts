import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import type { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import type { testabase } from "~/test/testabase";

export type TestDatabase = Awaited<ReturnType<typeof testabase>>;
export type Restriction = RestrictionEnumSchema.Type;

export const createRestrictedCategory = (
	database: TestDatabase,
	props: {
		slug: string;
		restriction: Restriction;
	},
) =>
	Effect.promise(async () => {
		const category = {
			id: genId(),
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

export const createUserRestriction = (
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
		const dateContext = yield* DateContextFx;
		const now = dateContext.now();

		yield* Effect.promise(() =>
			database.kysely
				.insertInto("user_restriction")
				.values({
					id: genId(),
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

export const createRestrictionProbeListings = (
	database: TestDatabase,
	props: {
		sellerId: string;
		title: string;
		slugPrefix: string;
	},
) =>
	Effect.gen(function* () {
		const noneCategory = yield* createRestrictedCategory(database, {
			slug: `${props.slugPrefix}-none`,
			restriction: "none",
		});
		const adultCategory = yield* createRestrictedCategory(database, {
			slug: `${props.slugPrefix}-adult`,
			restriction: "adult",
		});
		const restrictedCategory = yield* createRestrictedCategory(database, {
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
