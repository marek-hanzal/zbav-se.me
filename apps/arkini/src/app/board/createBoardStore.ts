import type { tBoardItem } from "@zbav-se.me/sdk/api/arkini";
import { create, type StoreApi, type UseBoundStore } from "zustand";

export namespace createBoardStore {
	export interface Store {
		items: tBoardItem[];
	}

	export interface Props {
		items: tBoardItem[];
	}

	export type Hook = UseBoundStore<StoreApi<Store>>;
}

export const createBoardStore = ({ items }: createBoardStore.Props): createBoardStore.Hook => {
	return create<createBoardStore.Store>(() => ({
		items,
	}));
};
