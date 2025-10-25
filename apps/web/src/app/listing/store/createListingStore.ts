import { dedupe } from "@use-pico/common";
import {
	apiListingCreateBody,
	type Category,
	type CategoryGroup,
	type CurrencyList,
	type ListingCreate,
	type ListingExpire,
} from "@zbav-se.me/sdk";
import { create } from "zustand";

export namespace createListingStore {
	export interface Props {
		photoCountLimit: number;
		defaultCurrency: CurrencyList;
	}

	export type Missing =
		| "photos"
		| "categoryGroup"
		| "category"
		| "condition"
		| "age"
		| "location"
		| "price"
		| "currency"
		| "expiresAt";

	export interface Store {
		//
		photoCountLimit: number;
		photos: (File | undefined)[];
		setPhoto(slot: number, photo: File | undefined): void;
		hasPhotos: boolean;
		//
		categoryGroup: CategoryGroup[];
		setCategoryGroup(categoryGroup: CategoryGroup[]): void;
		hasCategoryGroup: boolean;
		//
		category: Category[];
		setCategory(category: Category[]): void;
		hasCategory: boolean;
		//
		condition: number;
		setCondition(condition: number): void;
		hasCondition: boolean;
		//
		age: number;
		setAge(age: number): void;
		hasAge: boolean;
		//
		price: string | undefined;
		setPrice(price: string | undefined): void;
		getPrice(): number | undefined;
		hasPrice: boolean;
		//
		currency: string | undefined;
		setCurrency(currency: string | undefined): void;
		hasCurrency: boolean;
		//
		location: string | undefined;
		setLocation(location: string | undefined): void;
		hasLocation: boolean;
		//
		expiresAt: ListingExpire | undefined;
		setExpiresAt(expiresAt: ListingExpire | undefined): void;
		hasExpiresAt: boolean;
		//
		requiredCount: number;
		missing: Missing[];
		isValid: boolean;
		//
		get(): ListingCreate;
	}
}

const defaultMissing: createListingStore.Missing[] = [
	"category",
	"categoryGroup",
	"photos",
	"condition",
	"age",
	"location",
	"price",
	"expiresAt",
];

export const createListingStore = ({
	photoCountLimit,
	defaultCurrency,
}: createListingStore.Props) =>
	create<createListingStore.Store>((set, get) => ({
		photoCountLimit,
		photos: Array.from(
			{
				length: photoCountLimit,
			},
			() => undefined,
		),
		setPhoto(slot, photo) {
			set(({ photos: prev, missing }) => {
				const next = [
					...prev,
				];
				next[slot] = photo;

				const compact: (File | undefined)[] = next.filter(
					(f): f is File => !!f,
				);

				while (compact.length < photoCountLimit) {
					compact.push(undefined);
				}

				const hasPhotos = compact.some((photo) => !!photo);
				const $missing = dedupe<createListingStore.Missing[]>(
					hasPhotos
						? missing.filter((m) => m !== "photos")
						: [
								...missing,
								"photos",
							],
				);

				return {
					photos: compact,
					hasPhotos,
					missing: $missing,
					isValid: $missing.length === 0,
				};
			});
		},
		hasPhotos: false,
		//
		categoryGroup: [],
		setCategoryGroup(categoryGroup) {
			set(({ missing }) => {
				const $missing = dedupe<createListingStore.Missing[]>(
					categoryGroup.length === 0
						? [
								...missing,
								"categoryGroup",
							]
						: missing.filter((m) => m !== "categoryGroup"),
				);

				return {
					categoryGroup,
					hasCategoryGroup: categoryGroup.length > 0,
					// Reset category - idea is that when user changes category group, he also probably changes category
					category: [],
					hasCategory: false,
					//
					missing: $missing,
					isValid: $missing.length === 0,
				};
			});
		},
		hasCategoryGroup: false,
		//
		category: [],
		setCategory(category) {
			set(({ missing }) => {
				const $missing = dedupe<createListingStore.Missing[]>(
					category.length === 0
						? [
								...missing,
								"category",
							]
						: missing.filter((m) => m !== "category"),
				);

				return {
					category,
					hasCategory: category.length > 0,
					missing: $missing,
					isValid: $missing.length === 0,
				};
			});
		},
		hasCategory: false,
		//
		condition: 0,
		setCondition(condition) {
			set(({ missing }) => {
				const $missing = dedupe<createListingStore.Missing[]>(
					condition === 0
						? [
								...missing,
								"condition",
							]
						: missing.filter((m) => m !== "condition"),
				);

				return {
					condition,
					hasCondition: condition > 0,
					missing: $missing,
					isValid: $missing.length === 0,
				};
			});
		},
		hasCondition: false,
		//
		age: 0,
		setAge(age) {
			set(({ missing }) => {
				const $missing = dedupe<createListingStore.Missing[]>(
					age === 0
						? [
								...missing,
								"age",
							]
						: missing.filter((m) => m !== "age"),
				);
				return {
					age,
					hasAge: age > 0,
					missing: $missing,
					isValid: $missing.length === 0,
				};
			});
		},
		hasAge: false,
		//
		price: undefined,
		setPrice(price) {
			set(({ missing }) => {
				const value = price === "" ? undefined : price;
				const $missing = dedupe<createListingStore.Missing[]>(
					!value
						? [
								...missing,
								"price",
							]
						: missing.filter((m) => m !== "price"),
				);

				return {
					price: value,
					hasPrice: !!value,
					missing: $missing,
					isValid: $missing.length === 0,
				};
			});
		},
		getPrice() {
			const price = get().price;
			return price ? parseFloat(price) : undefined;
		},
		hasPrice: false,
		//
		currency: defaultCurrency,
		setCurrency(currency) {
			set(({ missing }) => {
				const $missing = dedupe<createListingStore.Missing[]>(
					currency === undefined
						? [
								...missing,
								"currency",
							]
						: missing.filter((m) => m !== "currency"),
				);
				return {
					currency,
					hasCurrency: currency !== undefined,
					missing: $missing,
					isValid: $missing.length === 0,
				};
			});
		},
		hasCurrency: true,
		//
		location: undefined,
		setLocation(location) {
			set(({ missing }) => {
				const $missing = dedupe<createListingStore.Missing[]>(
					location === undefined
						? [
								...missing,
								"location",
							]
						: missing.filter((m) => m !== "location"),
				);
				return {
					location,
					hasLocation: location !== undefined,
					missing: $missing,
					isValid: $missing.length === 0,
				};
			});
		},
		hasLocation: false,
		//
		expiresAt: undefined,
		setExpiresAt(expiresAt) {
			set(({ missing }) => {
				const $missing = dedupe<createListingStore.Missing[]>(
					expiresAt === undefined
						? [
								...missing,
								"expiresAt",
							]
						: missing.filter((m) => m !== "expiresAt"),
				);
				return {
					expiresAt,
					hasExpiresAt: !!expiresAt,
					missing: $missing,
					isValid: $missing.length === 0,
				};
			});
		},
		hasExpiresAt: false,
		//
		requiredCount: defaultMissing.length,
		missing: [
			...defaultMissing,
		],
		isValid: false,
		//
		get() {
			if (!get().isValid) {
				throw new Error("Cannot create listing: store is not valid");
			}

			const [categoryGroup] = get().categoryGroup;
			const [category] = get().category;

			return apiListingCreateBody.parse({
				price: get().getPrice(),
				condition: get().condition,
				age: get().age,
				locationId: get().location,
				categoryGroupId: categoryGroup?.id,
				categoryId: category?.id,
				currency: get().currency,
				expiresAt: get().expiresAt,
			} as ListingCreate);
		},
	}));
