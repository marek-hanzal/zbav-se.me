import { Effect } from "effect";
import { list } from "@/lib/common/rangedom/list";
import { rangedom } from "@/lib/common/rangedom/rangedom";
import { sample } from "@/lib/common/rangedom/sample";
import { DeliveryEnumSchema } from "~/common/delivery/enum/DeliveryEnumSchema";
import { ListingExpireEnumSchema } from "~/common/listing/enum/ListingExpireEnumSchema";
import { PriceTypeEnumSchema } from "~/common/price-type/enum/PriceTypeEnumSchema";
import { CurrencyEnumSchema } from "~/common/schema/CurrencyEnumSchema";
import { WarrantyEnumSchema } from "~/common/warranty/enum/WarrantyEnumSchema";
import type { SeedRunSummary } from "~/seed/seed/SeedRunSummary";
import { draftCreateFx } from "~/seller/draft/server/fx/draftCreateFx";
import { draftPatchFx } from "~/seller/draft/server/fx/draftPatchFx";
import { listingCreateFx } from "~/seller/listing/server/fx/listingCreateFx";
import ListingCategorySeedData from "~/server/@system/seed/data/listing-category-seed.json" with {
	type: "json",
};
import LocationQueries from "~/server/@system/seed/data/location.json" with { type: "json" };
import type { CategoryTableSchema } from "~/server/database/@table/CategoryTableSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { RuntimeErrorFx } from "~/server/error/RuntimeErrorFx";
import { locationAutocompleteFx } from "~/session/location/server/fx/locationAutocompleteFx";
import { categoryAttrOfFx } from "~/user/category/server/fx/categoryAttrOfFx";
import { ensureSeedUploadPoolFx } from "./ensureSeedUploadPoolFx";
import { ensureSeedUserFx } from "./ensureSeedUserFx";
import { SeedProgressContextFx } from "./SeedProgressContextFx";

const LISTING_CONDITIONS = [
	1,
	2,
	3,
	4,
	5,
	6,
] as const;

const LISTING_AGES = [
	1,
	2,
	3,
	4,
	5,
	6,
] as const;

const LISTING_EXPIRATIONS = Object.values(ListingExpireEnumSchema.enum);
const LISTING_WARRANTIES = Object.values(WarrantyEnumSchema.enum);
const LOCATION_QUERY_POOL = LocationQueries as string[];

type SeedBranchRecord = {
	title: string;
	description: string;
	pros: string[];
	cons: string[];
	priceMin: number;
	priceMax: number;
	priceSpikes: number[];
	delivery: DeliveryEnumSchema.Type[];
};

type SeedDataset = Record<string, SeedBranchRecord[]>;
type CategoryAttrMeta = {
	kind: string;
};

const seedDataset = ListingCategorySeedData as SeedDataset;

const withShuffle = <T>(items: readonly T[]) => {
	const next = items.slice();

	for (let index = next.length - 1; index > 0; index -= 1) {
		const swapIndex = Math.floor(Math.random() * (index + 1));
		const current = next[index];
		const swap = next[swapIndex];

		if (current === undefined || swap === undefined) {
			continue;
		}

		next[index] = swap;
		next[swapIndex] = current;
	}

	return next;
};

const toSeedBranch = (slug: string) => {
	return seedDataset[slug] ?? seedDataset.default ?? [];
};

const toPriceType = (record: SeedBranchRecord, random = Math.random) => {
	if (record.priceMax <= 0) {
		return PriceTypeEnumSchema.enum.free;
	}

	return random() < 0.82 ? PriceTypeEnumSchema.enum.fixed : PriceTypeEnumSchema.enum.haggle;
};

const toPrice = (record: SeedBranchRecord, random = Math.random) => {
	const shouldUseSpike = record.priceSpikes.length > 0 && random() < 0.18;

	if (shouldUseSpike) {
		return list(record.priceSpikes);
	}

	if (record.priceMax <= record.priceMin) {
		return record.priceMin;
	}

	return rangedom(record.priceMin, record.priceMax);
};

const withProsCons = (record: SeedBranchRecord) => {
	return {
		pros: sample(record.pros, rangedom(0, Math.min(5, record.pros.length))),
		cons: sample(record.cons, rangedom(0, Math.min(5, record.cons.length))),
	};
};

const withDeliverySelection = (record: SeedBranchRecord) => {
	if (record.delivery.length === 0) {
		return list([
			[
				DeliveryEnumSchema.enum.personal,
			],
		]);
	}

	return sample(record.delivery, rangedom(1, record.delivery.length));
};

const withListingTotalFx = Effect.fn("withListingTotalFx")(function* () {
	const { kysely } = yield* KyselyContextFx;

	const row = yield* tryDbFx(async () => {
		return kysely
			.selectFrom("listing")
			.select((eb) => eb.fn.countAll<string>().as("count"))
			.executeTakeFirstOrThrow();
	});

	return Number(row.count);
});

const withSupportedCategoriesFx = Effect.fn("withSupportedCategoriesFx")(function* () {
	const { kysely } = yield* KyselyContextFx;

	const categories = yield* tryDbFx(async () => {
		return kysely
			.selectFrom("category")
			.selectAll()
			.where("locale", "=", "cs")
			.orderBy("sort", "asc")
			.execute();
	});

	const supported: CategoryTableSchema.Type[] = [];

	for (const category of categories) {
		const attrs = (yield* categoryAttrOfFx({
			categoryId: category.id,
		})) as unknown as Array<CategoryAttrMeta>;
		const hasRequiredAttrs = attrs.some((attr) => attr.kind === "required");

		if (hasRequiredAttrs) {
			continue;
		}

		supported.push(category);
	}

	return supported;
});

const withSeedLocationsFx = Effect.fn("withSeedLocationsFx")(function* ({
	count,
}: {
	count: number;
}) {
	const resolved: Array<{
		id: string;
		label: string;
	}> = [];
	const queryPool = withShuffle(LOCATION_QUERY_POOL);
	const targetCount = Math.max(12, Math.min(queryPool.length, count));
	const seenIds = new Set<string>();

	for (const query of queryPool) {
		const locations = yield* locationAutocompleteFx({
			text: query,
			lang: "cs",
			limit: 5,
		});

		for (const location of locations) {
			if (!location?.id || seenIds.has(location.id)) {
				continue;
			}

			seenIds.add(location.id);
			resolved.push({
				id: location.id,
				label: location.city ?? location.address ?? query,
			});

			if (resolved.length >= targetCount) {
				return resolved;
			}
		}
	}

	if (resolved.length === 0) {
		return yield* new RuntimeErrorFx({
			message: "No seed locations were resolved for listings.",
		});
	}

	return resolved;
});

export namespace listingSeedFx {
	export interface Props {
		count: number;
		userEmail: string;
	}
}

export const listingSeedFx = Effect.fn("listingSeedFx")(function* ({
	count,
	userEmail,
}: listingSeedFx.Props) {
	const progress = yield* SeedProgressContextFx;
	const phasePlan: SeedRunSummary.Phase[] = [
		{
			name: "Resolving user",
			done: 0,
			total: 1,
			status: "pending",
		},
		{
			name: "Preparing categories/assets/lookups",
			done: 0,
			total: 4,
			status: "pending",
		},
		{
			name: "Creating drafts",
			done: 0,
			total: count,
			status: "pending",
		},
		{
			name: "Publishing listings",
			done: 0,
			total: count,
			status: "pending",
		},
		{
			name: "Collecting summary",
			done: 0,
			total: 1,
			status: "pending",
		},
	];

	yield* progress.updateSummary({
		summary: {
			phases: phasePlan,
		},
	});

	yield* progress.startPhase({
		name: "Resolving user",
		total: 1,
	});

	const user = yield* ensureSeedUserFx({
		email: userEmail,
	});

	yield* progress.updateSummary({
		summary: {
			userEmail,
			userId: user.id,
		},
	});
	yield* progress.log({
		message: `Using seed user ${userEmail}`,
	});
	yield* progress.advance();
	yield* progress.finishPhase();

	yield* progress.startPhase({
		name: "Preparing categories/assets/lookups",
		total: 3,
	});

	const beforeTotal = yield* withListingTotalFx();
	yield* progress.updateSummary({
		summary: {
			beforeTotal,
		},
	});
	yield* progress.log({
		message: `Current listing total is ${beforeTotal}`,
	});
	yield* progress.advance();

	const supportedCategories = yield* withSupportedCategoriesFx();
	yield* progress.log({
		message: `Prepared ${supportedCategories.length} publishable categories`,
	});
	yield* progress.advance();

	const locations = yield* withSeedLocationsFx({
		count,
	});
	yield* progress.log({
		message: `Prepared ${locations.length} reusable locations`,
	});
	yield* progress.advance();

	const uploadPool = yield* ensureSeedUploadPoolFx({
		userId: user.id,
		targetCount: Math.min(64, Math.max(12, count * 2)),
	});
	yield* progress.log({
		message: `Prepared ${uploadPool.length} reusable uploads`,
	});
	yield* progress.advance();
	yield* progress.finishPhase();

	if (supportedCategories.length === 0) {
		return yield* new RuntimeErrorFx({
			message: "No publishable categories are available for listing seed.",
		});
	}

	if (uploadPool.length === 0) {
		return yield* new RuntimeErrorFx({
			message: "No reusable uploads are available for listing seed.",
		});
	}

	type DraftPlan = {
		category: CategoryTableSchema.Type;
		description: string;
		delivery: SeedBranchRecord["delivery"];
		draftId: string;
		price: number;
		priceType: "fixed" | "free" | "haggle";
		cons: string[];
		locationId: string;
		locationLabel: string;
		pros: string[];
		title: string;
		uploadCount: number;
		uploadIds: string[];
	};

	const draftPlans: DraftPlan[] = [];

	yield* progress.startPhase({
		name: "Creating drafts",
		total: count,
	});

	for (let index = 0; index < count; index++) {
		const category = list(supportedCategories);
		const branch = toSeedBranch(category.slug);

		if (branch.length === 0) {
			return yield* new RuntimeErrorFx({
				message: `Seed dataset is empty for category ${category.slug} and default fallback.`,
			});
		}

		const record = list(branch);
		const priceType = toPriceType(record);
		const price = priceType === PriceTypeEnumSchema.enum.free ? 0 : toPrice(record);
		const location = list(locations);
		const uploadCount = rangedom(1, Math.min(4, uploadPool.length));
		const uploadIds = sample(uploadPool, uploadCount);
		const prosCons = withProsCons(record);
		const delivery = withDeliverySelection(record);

		const draft = yield* draftCreateFx({
			userId: user.id,
		});

		yield* draftPatchFx({
			userId: user.id,
			query: {
				where: {
					id: draft.id,
				},
			},
			scope: {
				userId: user.id,
			},
			patch: {
				categoryId: category.id,
				title: record.title,
				description: record.description,
				locationId: location.id,
				priceType,
				price,
				currency: CurrencyEnumSchema.enum.CZK,
				expires: list(LISTING_EXPIRATIONS),
				uploadIds,
				delivery,
				pros: prosCons.pros,
				cons: prosCons.cons,
				warranty: list(LISTING_WARRANTIES),
				condition: list([
					...LISTING_CONDITIONS,
				]),
				age: list([
					...LISTING_AGES,
				]),
			},
		});

		draftPlans.push({
			draftId: draft.id,
			category,
			title: record.title,
			description: record.description,
			locationId: location.id,
			locationLabel: location.label,
			priceType,
			price,
			uploadIds,
			uploadCount,
			delivery,
			pros: prosCons.pros,
			cons: prosCons.cons,
		});

		yield* progress.log({
			message: `Draft ${index + 1}/${count}: ${record.title} (${category.slug}, ${location.label})`,
		});
		yield* progress.advance();
	}

	yield* progress.finishPhase();

	yield* progress.startPhase({
		name: "Publishing listings",
		total: draftPlans.length,
	});

	for (const [index, draftPlan] of draftPlans.entries()) {
		yield* listingCreateFx({
			userId: user.id,
			draftId: draftPlan.draftId,
		});
		yield* progress.updateSummary({
			summary: {
				createdCount: index + 1,
			},
		});
		yield* progress.log({
			message: `Published ${index + 1}/${draftPlans.length}: ${draftPlan.title}`,
		});
		yield* progress.advance();
	}

	yield* progress.finishPhase();

	yield* progress.startPhase({
		name: "Collecting summary",
		total: 1,
	});

	const afterTotal = yield* withListingTotalFx();
	yield* progress.updateSummary({
		summary: {
			afterTotal,
		},
	});
	yield* progress.log({
		message: `New listing total is ${afterTotal}`,
	});
	yield* progress.advance();
	yield* progress.finishPhase();

	return {
		seedId: "listings",
		seedLabel: "Listings",
		userEmail,
		userId: user.id,
		requestedCount: count,
		createdCount: draftPlans.length,
		beforeTotal,
		afterTotal,
		phases: phasePlan.map((phase) => ({
			...phase,
			done: phase.total,
			status: "completed",
		})),
		currentPhase: null,
	};
});
