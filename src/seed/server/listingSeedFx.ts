import { Effect } from "effect";
import type { SeedRunSummary } from "~/seed/seed/SeedRunSummary";
import { draftCreateFx } from "~/seller/draft/server/fx/draftCreateFx";
import { draftPatchFx } from "~/seller/draft/server/fx/draftPatchFx";
import { listingCreateFx } from "~/seller/listing/server/fx/listingCreateFx";
import ListingCategorySeedData from "~/server/@system/seed/data/listing-category-seed.json" with {
	type: "json",
};
import type { CategoryTableSchema } from "~/server/database/@table/CategoryTableSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { RuntimeErrorFx } from "~/server/error/RuntimeErrorFx";
import { locationAutocompleteFx } from "~/session/location/server/fx/locationAutocompleteFx";
import { categoryAttrOfFx } from "~/user/category/server/fx/categoryAttrOfFx";
import { UploadContextFx } from "~/user/upload/server/context/UploadContextFx";
import { uploadCreateFx } from "~/user/upload/server/fx/uploadCreateFx";
import { ensureSeedUserFx } from "./ensureSeedUserFx";
import { SeedProgressContextFx } from "./SeedProgressContextFx";

const LOCATION_QUERIES = [
	"Praha",
	"Brno",
	"Ostrava",
	"Plzen",
	"Olomouc",
] as const;

const LISTING_CONDITIONS = [
	3,
	4,
	5,
	6,
] as const;

const LISTING_AGES = [
	2,
	3,
	4,
	5,
	6,
] as const;

const LISTING_EXPIRATIONS = [
	"7-days",
	"14-days",
	"1-month",
] as const;

const LISTING_WARRANTIES = [
	"warranty",
	"no-warranty",
	"custom",
] as const;

type SeedBranchRecord = {
	title: string;
	description: string;
	pros: string[];
	cons: string[];
	priceMin: number;
	priceMax: number;
	priceSpikes: number[];
	delivery: Array<"other" | "package" | "personal" | "post">;
};

type SeedDataset = Record<string, SeedBranchRecord[]>;
type CategoryAttrMeta = {
	kind: string;
};

const seedDataset = ListingCategorySeedData as SeedDataset;

const withRandomItem = <T>(items: readonly T[], random = Math.random) => {
	if (items.length === 0) {
		throw new Error("Expected at least one item in random selection.");
	}

	const index = Math.floor(random() * items.length);
	const item = items[index];

	if (item === undefined) {
		throw new Error("Random selection resolved to an undefined item.");
	}

	return item;
};

const toSeedBranch = (slug: string) => {
	return seedDataset[slug] ?? seedDataset.default ?? [];
};

const toPriceType = (record: SeedBranchRecord, random = Math.random) => {
	if (record.priceMax <= 0) {
		return "free" as const;
	}

	return random() < 0.82 ? "fixed" : "haggle";
};

const toPrice = (record: SeedBranchRecord, random = Math.random) => {
	const shouldUseSpike = record.priceSpikes.length > 0 && random() < 0.18;

	if (shouldUseSpike) {
		return withRandomItem(record.priceSpikes, random);
	}

	if (record.priceMax <= record.priceMin) {
		return record.priceMin;
	}

	const delta = record.priceMax - record.priceMin;
	return record.priceMin + Math.round(random() * delta);
};

const toUploadUrls = (cdn: string, seed: number, count: number) => {
	const normalizedCdn = cdn.replace(/\/$/, "");

	return Array.from({
		length: count,
	}).map((_, index) => {
		return `${normalizedCdn}/seed/listings/${seed}-${index + 1}.jpg`;
	});
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

const withSeedLocationsFx = Effect.fn("withSeedLocationsFx")(function* () {
	const resolved: Array<{
		id: string;
		label: string;
	}> = [];

	for (const query of LOCATION_QUERIES) {
		const locations = yield* locationAutocompleteFx({
			text: query,
			lang: "cs",
			limit: 1,
		});

		const location = locations[0];

		if (!location?.id) {
			continue;
		}

		resolved.push({
			id: location.id,
			label: location.city ?? location.address ?? query,
		});
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
	const uploadContext = yield* UploadContextFx;
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
			total: 3,
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

	const locations = yield* withSeedLocationsFx();
	yield* progress.log({
		message: `Prepared ${locations.length} reusable locations`,
	});
	yield* progress.advance();
	yield* progress.finishPhase();

	if (supportedCategories.length === 0) {
		return yield* new RuntimeErrorFx({
			message: "No publishable categories are available for listing seed.",
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
		const category = withRandomItem(supportedCategories);
		const branch = toSeedBranch(category.slug);

		if (branch.length === 0) {
			return yield* new RuntimeErrorFx({
				message: `Seed dataset is empty for category ${category.slug} and default fallback.`,
			});
		}

		const record = withRandomItem(branch);
		const priceType = toPriceType(record);
		const price = priceType === "free" ? 0 : toPrice(record);
		const location = withRandomItem(locations);
		const uploadCount = 1 + (index % 3);
		const uploadUrls = toUploadUrls(uploadContext.cdn, index + 1, uploadCount);
		const uploadIds: string[] = [];

		for (const url of uploadUrls) {
			const upload = yield* uploadCreateFx({
				userId: user.id,
				access: "public",
				url,
			});

			uploadIds.push(upload.id);
		}

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
				currency: "CZK",
				expires: withRandomItem(LISTING_EXPIRATIONS),
				uploadIds,
				delivery: record.delivery,
				pros: record.pros.slice(0, 5),
				cons: record.cons.slice(0, 5),
				warranty: withRandomItem(LISTING_WARRANTIES),
				condition: withRandomItem(LISTING_CONDITIONS),
				age: withRandomItem(LISTING_AGES),
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
			delivery: record.delivery,
			pros: record.pros.slice(0, 5),
			cons: record.cons.slice(0, 5),
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
