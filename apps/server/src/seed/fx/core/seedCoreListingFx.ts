import { list, rangedom, sample } from "@use-pico/common/rangedom";
import { Effect } from "effect";
import { draftCreateFx } from "~/@seller-user/draft/fx/draftCreateFx";
import { listingCreateFx } from "~/@seller-user/listing/fx/listingCreateFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { SeedProgressContextFx } from "~/seed/context/SeedProgressContextFx";
import Cons from "~/seed/data/listing-cons.json";
import Descriptions from "~/seed/data/listing-description.json";
import Pros from "~/seed/data/listing-pros.json";
import Titles from "~/seed/data/listing-title.json";

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
	const withProsCons = () => {
		const prosCount = rangedom(0, 5);
		const consCount = rangedom(0, 5);

		return {
			pros: sample(Pros, prosCount),
			cons: sample(Cons, consCount),
		} as const;
	};

	for (let i = 0; i < draftDeficit; i++) {
		const categoryId = categoryIds.length > 0 ? list(categoryIds) : undefined;
		const locationId = locationIds.length > 0 ? list(locationIds) : undefined;
		if (!categoryId || !locationId) {
			break;
		}

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
	}

	for (let i = 0; i < listingDeficit; i++) {
		const categoryId = categoryIds.length > 0 ? list(categoryIds) : undefined;
		const locationId = locationIds.length > 0 ? list(locationIds) : undefined;
		if (!categoryId || !locationId) {
			break;
		}

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
	}

	yield* progress.log({
		message: `Draft/listing generation done (draft=${draftDeficit}, listing=${listingDeficit})`,
	});
});

export type seedCoreListingFx = ReturnType<typeof seedCoreListingFx>;
