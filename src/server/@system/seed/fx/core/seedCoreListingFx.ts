import { Effect } from "effect";
import { list, rangedom, sample } from "@/lib/common/rangedom";
import { SeedProgressContextFx } from "~/server/@system/seed/context/withSeedProgressFx";
import CategorySeed from "~/server/@system/seed/data/listing-category-seed.json" with {
	type: "json",
};
import { withSeedConcurrency } from "~/server/@system/seed/fx/core/seedConcurrency";
import { seedDraftInsertFx } from "~/server/@system/seed/fx/core/seedDraftInsertFx";
import { seedListingInsertFx } from "~/server/@system/seed/fx/core/seedListingInsertFx";
import { withRandomPastDate } from "~/server/@system/seed/fx/time/seedTime";
import { withSeedNowFx } from "~/server/@system/seed/fx/time/withSeedNowFx";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

const LISTING_SEED_CONCURRENCY = withSeedConcurrency("SEED_LISTING_CONCURRENCY");
const LISTING_TX_CHUNK_SIZE = 25;

export const seedCoreListingFx = Effect.fn("seedCoreListingFx")(function* ({
	userId,
	uploadIds,
	draftDeficit,
	listingDeficit,
}: {
	userId: string;
	uploadIds: string[];
	draftDeficit: number;
	listingDeficit: number;
}) {
	const progress = yield* SeedProgressContextFx;
	const { kysely } = yield* KyselyContextFx;

	const categories = yield* tryDbFx(async () =>
		kysely
			.selectFrom("category")
			.select([
				"id",
				"slug",
			])
			.limit(512)
			.execute(),
	);
	const locations = yield* tryDbFx(async () =>
		kysely.selectFrom("location").select("id").limit(10000).execute(),
	);

	const categoryIds = categories.map((item) => item.id);
	const categorySlugs = categories.map((item) => item.slug);
	const locationIds = locations.map((item) => item.id);
	if (categoryIds.length === 0 || locationIds.length === 0) {
		yield* progress.log({
			message: "Draft/listing generation skipped (missing category/location dataset)",
		});
		return;
	}

	const getCategorySeedData = (categorySlug: string) => {
		const seedData = CategorySeed[categorySlug as keyof typeof CategorySeed];
		if (seedData) {
			return seedData;
		}
		return CategorySeed.default;
	};

	const withProsCons = (seedData: { pros: string[]; cons: string[] }) => {
		const prosCount = rangedom(0, 5);
		const consCount = rangedom(0, 5);

		return {
			pros: sample(seedData.pros, prosCount),
			cons: sample(seedData.cons, consCount),
		};
	};

	const toChunks = (size: number) => (total: number) => {
		const indices = Array.from({
			length: total,
		}).map((_, i) => i);
		const chunks: number[][] = [];
		for (let i = 0; i < indices.length; i += size) {
			chunks.push(indices.slice(i, i + size));
		}
		return chunks;
	};

	yield* Effect.forEach(
		toChunks(LISTING_TX_CHUNK_SIZE)(draftDeficit),
		(chunk) =>
			withTransactionFx(
				Effect.gen(function* () {
					yield* Effect.forEach(chunk, () =>
						Effect.gen(function* () {
							const categoryId = list(categoryIds);

							const categoryIndex = categoryIds.indexOf(categoryId);
							const categorySlug = categorySlugs[categoryIndex] ?? "default";
							const seedData = getCategorySeedData(categorySlug);

							const locationId = list(locationIds);

							yield* seedDraftInsertFx({
								...withProsCons(seedData),
								userId,
								title: seedData.titles.length > 0 ? list(seedData.titles) : "Item",
								description:
									seedData.descriptions.length > 0
										? list(seedData.descriptions)
										: "",
								categoryId,
								locationId,
								expiresAt: list([
									"7-days",
									"14-days",
									"1-month",
								]),
								uploadIds: sample(
									uploadIds,
									rangedom(1, Math.min(4, uploadIds.length)),
								),
							}).pipe(withSeedNowFx(withRandomPastDate()));
						}),
					);
					yield* progress.advance({
						delta: chunk.length,
					});
				}),
			),
		{
			concurrency: LISTING_SEED_CONCURRENCY,
		},
	);

	yield* Effect.forEach(
		toChunks(LISTING_TX_CHUNK_SIZE)(listingDeficit),
		(chunk) =>
			withTransactionFx(
				Effect.gen(function* () {
					yield* Effect.forEach(chunk, () =>
						Effect.gen(function* () {
							const categoryId = list(categoryIds);

							const categoryIndex = categoryIds.indexOf(categoryId);
							const categorySlug = categorySlugs[categoryIndex] ?? "default";
							const seedData = getCategorySeedData(categorySlug);

							const locationId = list(locationIds);

							yield* seedListingInsertFx({
								...withProsCons(seedData),
								userId,
								title: seedData.titles.length > 0 ? list(seedData.titles) : "Item",
								description:
									seedData.descriptions.length > 0
										? list(seedData.descriptions)
										: null,
								categoryId,
								locationId,
								age: rangedom(1, 6),
								condition: rangedom(1, 6),
								price:
									seedData.priceSpikes && rangedom(0, 10) > 8
										? list(seedData.priceSpikes)
										: rangedom(seedData.priceMin, seedData.priceMax),
								priceType: list([
									"closed",
									"open",
								]),
								restriction: "none",
								delivery: [
									"personal",
								],
								warranty: null,
								expiresAt: list([
									"7-days",
									"14-days",
									"1-month",
								]),
								uploadIds: sample(
									uploadIds,
									rangedom(1, Math.min(6, uploadIds.length)),
								),
							}).pipe(withSeedNowFx(withRandomPastDate()));
						}),
					);
					yield* progress.advance({
						delta: chunk.length,
					});
				}),
			),
		{
			concurrency: LISTING_SEED_CONCURRENCY,
		},
	);

	yield* progress.log({
		message: `Draft/listing generation done (draft=${draftDeficit}, listing=${listingDeficit})`,
	});
});

export type seedCoreListingFx = ReturnType<typeof seedCoreListingFx>;
