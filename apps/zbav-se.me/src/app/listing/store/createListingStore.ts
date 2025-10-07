import { dedupe } from "@use-pico/common";
import { create } from "zustand";
import type { CategorySchema } from "~/app/category/db/CategorySchema";
import type { CategoryGroupSchema } from "~/app/category-group/db/CategoryGroupSchema";

export namespace createListingStore {
	export interface Props {
		photoCountLimit: number;
	}

	export type Missing =
		| "photos"
		| "categoryGroup"
		| "category"
		| "condition"
		| "age";

	export interface Store {
		photoCountLimit: number;
		photos: (File | undefined)[];
		setPhoto(slot: number, photo: File | undefined): void;
		hasPhotos: boolean;
		//
		categoryGroup: CategoryGroupSchema.Type[];
		setCategoryGroup(categoryGroup: CategoryGroupSchema.Type[]): void;
		hasCategoryGroup: boolean;
		//
		category: CategorySchema.Type[];
		setCategory(category: CategorySchema.Type[]): void;
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
		missing: Missing[];
		isValid: boolean;
	}
}

export const createListingStore = ({
	photoCountLimit,
}: createListingStore.Props) =>
	create<createListingStore.Store>((set) => ({
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
		missing: [
			"category",
			"categoryGroup",
			"photos",
			"condition",
			"age",
		],
		isValid: false,
	}));
