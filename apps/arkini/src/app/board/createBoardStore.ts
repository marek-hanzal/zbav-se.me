import type { tBoardItem } from "@zbav-se.me/sdk/api/arkini";
import { create, type StoreApi, type UseBoundStore } from "zustand";

function toItemsById(items: tBoardItem[]): Record<string, tBoardItem> {
	return Object.fromEntries(
		items.map((it) => [
			it.id,
			it,
		]),
	);
}

function toOrderedArray(itemsById: Record<string, tBoardItem>): tBoardItem[] {
	return Object.values(itemsById).sort(
		(a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
	);
}

export namespace createBoardStore {
	export interface Store {
		itemsById: Record<string, tBoardItem>;
		items: tBoardItem[];

		/** Replace all items (e.g. from API fetch) */
		setItems(items: tBoardItem[]): void;

		/** Patch a single item by id */
		patch(id: string, patch: Partial<tBoardItem>): void;
	}

	export interface Props {
		items: tBoardItem[];
	}

	export type Hook = UseBoundStore<StoreApi<Store>>;
}

export const createBoardStore = ({ items }: createBoardStore.Props): createBoardStore.Hook => {
	return create<createBoardStore.Store>((set) => ({
		itemsById: toItemsById(items),
		items: toOrderedArray(toItemsById(items)),

		setItems(items) {
			const itemsById = toItemsById(items);

			set({
				itemsById,
				items: toOrderedArray(itemsById),
			});
		},

		patch(id, patch) {
			set((prev) => {
				const current = prev.itemsById[id];
				if (!current) {
					return prev;
				}

				const itemsById = {
					...prev.itemsById,
					[id]: {
						...current,
						...patch,
					},
				};

				return {
					itemsById,
					items: toOrderedArray(itemsById),
				};
			});
		},
	}));
};
