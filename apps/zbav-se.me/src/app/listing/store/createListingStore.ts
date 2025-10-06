import { create } from "zustand";
import type { CategorySchema } from "~/app/category/db/CategorySchema";
import type { CategoryGroupSchema } from "~/app/category-group/db/CategoryGroupSchema";

export namespace createListingStore {
	export interface Props {
		photoCountLimit: number;
	}

	export type Missing = "photos" | "categoryGroup" | "category";

	export interface Store {
		photoCountLimit: number;
		photos: (File | undefined)[];
		setPhoto(slot: number, photo: File | undefined): void;
		hasPhotos(): boolean;
		//
		categoryGroup: CategoryGroupSchema.Type[];
		setCategoryGroup(categoryGroup: CategoryGroupSchema.Type[]): void;
		//
		category: CategorySchema.Type[];
		setCategory(category: CategorySchema.Type[]): void;
		//
		missing(): Missing[];
		isValid(): boolean;
	}
}

export const createListingStore = ({
	photoCountLimit,
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
			set(({ photos: prev }) => {
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

				return {
					photos: compact,
				};
			});
		},
		hasPhotos() {
			return get().photos.some((photo) => !!photo);
		},
		//
		categoryGroup: [],
		setCategoryGroup(categoryGroup) {
			set({
				categoryGroup,
			});
		},
		//
		category: [],
		setCategory(category) {
			set({
				category,
			});
		},
		//
		missing() {
			const missing: createListingStore.Missing[] = [];

			if (!get().hasPhotos()) {
				missing.push("photos");
			}

			if (get().categoryGroup.length === 0) {
				missing.push("categoryGroup");
			}

			if (get().category.length === 0) {
				missing.push("category");
			}

			return missing;
		},
		isValid() {
			return get().missing().length === 0;
		},
	}));
