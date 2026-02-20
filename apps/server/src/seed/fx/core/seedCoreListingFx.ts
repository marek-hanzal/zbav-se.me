import { list, rangedom, sample } from "@use-pico/common/rangedom";
import { Effect } from "effect";
import { draftCreateFx } from "~/@seller-user/draft/fx/draftCreateFx";
import { listingCreateFx } from "~/@seller-user/listing/fx/listingCreateFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { SeedProgressContextFx } from "~/seed/context/SeedProgressContextFx";
import Cons from "~/seed/data/listing-cons.json";
import Descriptions from "~/seed/data/listing-description.json";
import Pros from "~/seed/data/listing-pros.json";
import Titles from "~/seed/data/listing-title.json";
import { withSeedConcurrency } from "~/seed/fx/core/seedConcurrency";

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
		kysely.selectFrom("category").select("id").limit(512).execute(),
	);
	const locations = yield* tryDbFx(async () =>
		kysely.selectFrom("location").select("id").limit(2048).execute(),
	);

	const categoryIds = categories.map((item) => item.id);
	const locationIds = locations.map((item) => item.id);
	if (categoryIds.length === 0 || locationIds.length === 0) {
		yield* progress.log({
			message: "Draft/listing generation skipped (missing category/location dataset)",
		});
		return;
	}

	const withProsCons = () => {
		const prosCount = rangedom(0, 5);
		const consCount = rangedom(0, 5);

		return {
			pros: sample(Pros, prosCount),
			cons: sample(Cons, consCount),
		} as const;
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
				Effect.forEach(chunk, () =>
					Effect.gen(function* () {
						const categoryId = list(categoryIds);
						const locationId = list(locationIds);

						yield* draftCreateFx({
							...withProsCons(),
							userId,
							title: Titles.length > 0 ? list(Titles) : "Item",
							description: Descriptions.length > 0 ? list(Descriptions) : "",
							categoryId,
							locationId,
							expiresAt: list([
								"7-days",
								"14-days",
								"1-month",
							]),
							uploadIds: sample(uploadIds, rangedom(1, Math.min(4, uploadIds.length))),
						});

						yield* progress.advance({
							delta: 1,
						});
					}),
				),
			),
		{
			concurrency: LISTING_SEED_CONCURRENCY,
		},
	);

	yield* Effect.forEach(
		toChunks(LISTING_TX_CHUNK_SIZE)(listingDeficit),
		(chunk) =>
			withTransactionFx(
				Effect.forEach(chunk, (i) =>
					Effect.gen(function* () {
						const categoryId = list(categoryIds);
						const locationId = list(locationIds);

						yield* listingCreateFx({
							...withProsCons(),
							userId,
							title: `${Titles.length > 0 ? list(Titles) : "Item"} #${i + 1}`,
							description: Descriptions.length > 0 ? list(Descriptions) : null,
							categoryId,
							locationId,
							age: rangedom(0, 5),
							condition: rangedom(0, 5),
							price: rangedom(1, 100_000),
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
							uploadIds: sample(uploadIds, rangedom(1, Math.min(6, uploadIds.length))),
						});

						yield* progress.advance({
							delta: 1,
						});
					}),
				),
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
