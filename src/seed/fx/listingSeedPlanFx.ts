import { Effect } from "effect";
import { match } from "ts-pattern";
import { CurrencyEnumSchema } from "~/application/schema/CurrencyEnumSchema";
import type { CategoryTableSchema } from "~/database/schema/CategoryTableSchema";
import type { ListingAttrDecimalTableSchema } from "~/database/schema/ListingAttrDecimalTableSchema";
import type { ListingAttrEnumMultiTableSchema } from "~/database/schema/ListingAttrEnumMultiTableSchema";
import type { ListingAttrEnumSingleTableSchema } from "~/database/schema/ListingAttrEnumSingleTableSchema";
import type { ListingAttrNumberTableSchema } from "~/database/schema/ListingAttrNumberTableSchema";
import type { ListingAttrTextTableSchema } from "~/database/schema/ListingAttrTextTableSchema";
import { DeliveryEnumSchema } from "~/delivery/schema/DeliveryEnumSchema";
import { genId } from "~/identity/fn/genId";
import { ListingExpireEnumSchema } from "~/listing/schema/ListingExpireEnumSchema";
import { PriceTypeEnumSchema } from "~/price-type/schema/PriceTypeEnumSchema";
import { list } from "~/random/fn/list";
import { rangedom } from "~/random/fn/rangedom";
import { sample } from "~/random/fn/sample";
import type { CategoryAttrOfSchema } from "~/user-category/schema/CategoryAttrOfSchema";
import { WarrantyEnumSchema } from "~/warranty/schema/WarrantyEnumSchema";

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
const PLAN_YIELD_INTERVAL = 1000;

export type SeedBranchRecord = {
	title: string;
	description: string;
	pros: string[];
	cons: string[];
	priceMin: number;
	priceMax: number;
	priceSpikes: number[];
	delivery: DeliveryEnumSchema.Type[];
};

export type SeedResolvedLocation = {
	id: string;
	label: string;
};

export type SeedResolvedUpload = {
	id: string;
	url: string;
};

type SeedListingAttrs = {
	decimal: ListingAttrDecimalTableSchema.Type[];
	number: ListingAttrNumberTableSchema.Type[];
	enumMulti: ListingAttrEnumMultiTableSchema.Type[];
	enumSingle: ListingAttrEnumSingleTableSchema.Type[];
	text: ListingAttrTextTableSchema.Type[];
};

export type SeedListingPlan = {
	title: string;
	description: string;
	listingId: string;
	galleryId: string;
	categoryId: string;
	locationId: string;
	locationLabel: string;
	restriction: null;
	priceType: PriceTypeEnumSchema.Type;
	price: number;
	currency: CurrencyEnumSchema.Type;
	expires: ListingExpireEnumSchema.Type;
	condition: number;
	age: number;
	delivery: DeliveryEnumSchema.Type[];
	warranty: WarrantyEnumSchema.Type;
	pros: string[];
	cons: string[];
	sourceUploads: SeedResolvedUpload[];
	attrs: SeedListingAttrs;
};

type SeedCategoryAttrLoader = (
	categoryId: string,
) => Effect.Effect<CategoryAttrOfSchema.Type[], never, unknown>;

type SeedProgressReporter = (input: {
	count: number;
	plan: SeedListingPlan;
	category: CategoryTableSchema.Type;
}) => Effect.Effect<void, never, never>;

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

const withEmptyAttrs = (_listingId: string): SeedListingAttrs => ({
	decimal: [],
	number: [],
	enumMulti: [],
	enumSingle: [],
	text: [],
});

export const withCategoryAttrCacheFx = (loadCategoryAttrs: SeedCategoryAttrLoader) => {
	const cache = new Map<string, CategoryAttrOfSchema.Type[]>();

	return (categoryId: string) =>
		Effect.gen(function* () {
			const cached = cache.get(categoryId);

			if (cached) {
				return cached;
			}

			const attrs = yield* loadCategoryAttrs(categoryId);
			cache.set(categoryId, attrs);

			return attrs;
		});
};

const toListingAttrs = ({
	fields,
	listingId,
}: {
	fields: CategoryAttrOfSchema.Type[];
	listingId: string;
}): SeedListingAttrs => {
	const attrs = withEmptyAttrs(listingId);

	for (const field of fields) {
		match(field)
			.with(
				{
					type: "decimal",
				},
				({ min, max }) => {
					attrs.decimal.push({
						listingId,
						fieldId: field.name,
						value: rangedom(min ?? 0, max ?? 1024) / 100,
					});
				},
			)
			.with(
				{
					type: "number",
				},
				({ min, max }) => {
					attrs.number.push({
						listingId,
						fieldId: field.name,
						value: rangedom(min ?? 0, max ?? 1024),
					});
				},
			)
			.with(
				{
					type: "range",
				},
				({ min, max }) => {
					attrs.decimal.push({
						listingId,
						fieldId: field.name,
						value: rangedom(min ?? 0, max ?? 1024),
					});
				},
			)
			.with(
				{
					type: "year",
				},
				({ min, max }) => {
					attrs.number.push({
						listingId,
						fieldId: field.name,
						value: rangedom(min ?? 1940, max ?? 2099),
					});
				},
			)
			.with(
				{
					type: "text",
				},
				() => {
					attrs.text.push({
						listingId,
						fieldId: field.name,
						value: genId(),
					});
				},
			)
			.with(
				{
					type: "enum-multi",
				},
				({ max, options }) => {
					if (options.length === 0) {
						return;
					}

					const values = sample(options, Math.min(max ?? 3, options.length)).map(
						({ value }) => ({
							listingId,
							fieldId: field.name,
							value,
						}),
					);

					attrs.enumMulti.push(...values);
				},
			)
			.with(
				{
					type: "enum-single",
				},
				({ options }) => {
					const option = list(options);

					if (!option) {
						return;
					}

					attrs.enumSingle.push({
						listingId,
						fieldId: field.name,
						value: option.value,
					});
				},
			)
			.exhaustive();
	}

	return attrs;
};

export namespace buildSeedListingPlansFx {
	export interface Props {
		count: number;
		offset?: number;
		supportedCategories: CategoryTableSchema.Type[];
		locations: SeedResolvedLocation[];
		uploadPool: SeedResolvedUpload[];
		toSeedBranch(slug: string): SeedBranchRecord[];
		loadCategoryAttrs: SeedCategoryAttrLoader;
		onPlanned?: SeedProgressReporter;
	}
}

export const buildSeedListingPlansFx = Effect.fn("buildSeedListingPlansFx")(function* ({
	count,
	offset = 0,
	supportedCategories,
	locations,
	uploadPool,
	toSeedBranch,
	loadCategoryAttrs,
	onPlanned,
}: buildSeedListingPlansFx.Props) {
	const getCategoryAttrs = withCategoryAttrCacheFx(loadCategoryAttrs);
	const plans: SeedListingPlan[] = [];

	for (let index = 0; index < count; index += 1) {
		const category = list(supportedCategories);
		const branch = toSeedBranch(category.slug);
		const record = list(branch);
		const fields = yield* getCategoryAttrs(category.id);
		const priceType = toPriceType(record);
		const price = priceType === PriceTypeEnumSchema.enum.free ? 0 : toPrice(record);
		const location = list(locations);
		const uploadCount = rangedom(1, Math.min(4, uploadPool.length));
		const sourceUploads = sample(uploadPool, uploadCount);
		const prosCons = withProsCons(record);
		const listingId = genId();

		const plan: SeedListingPlan = {
			title: record.title,
			description: record.description,
			listingId,
			galleryId: genId(),
			categoryId: category.id,
			locationId: location.id,
			locationLabel: location.label,
			restriction: null,
			priceType,
			price,
			currency: CurrencyEnumSchema.enum.CZK,
			expires: list(LISTING_EXPIRATIONS),
			condition: list([
				...LISTING_CONDITIONS,
			]),
			age: list([
				...LISTING_AGES,
			]),
			delivery: withDeliverySelection(record),
			warranty: list(LISTING_WARRANTIES),
			pros: prosCons.pros,
			cons: prosCons.cons,
			sourceUploads,
			attrs: toListingAttrs({
				fields,
				listingId,
			}),
		};

		plans.push(plan);

		if (onPlanned) {
			yield* onPlanned({
				count: offset + index + 1,
				plan,
				category,
			});
		}

		if ((index + 1) % PLAN_YIELD_INTERVAL === 0) {
			yield* Effect.yieldNow;
		}
	}

	return plans;
});
