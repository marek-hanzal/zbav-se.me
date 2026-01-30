import { create, type StoreApi, type UseBoundStore } from "zustand";

export namespace createBoardStore {
	export interface Item {
		x: number;
		y: number;
	}

	export interface Store {
		items: Item[];
	}

	export interface Props {
		items: Item[];
	}

	export type Hook = UseBoundStore<StoreApi<Store>>;
}

export const createBoardStore = ({ items }: createBoardStore.Props): createBoardStore.Hook => {
	return create<createBoardStore.Store>(() => ({
		items,
	}));
};
