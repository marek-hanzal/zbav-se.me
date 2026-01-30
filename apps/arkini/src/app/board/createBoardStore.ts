import type { tItem } from "@zbav-se.me/sdk/api/arkini";
import { create, type StoreApi, type UseBoundStore } from "zustand";

export namespace createBoardStore {
	export interface Store {
		items: tItem[];
	}

	export interface Props {
		items: tItem[];
	}

	export type Hook = UseBoundStore<StoreApi<Store>>;
}

export const createBoardStore = ({ items }: createBoardStore.Props): createBoardStore.Hook => {
	return create<createBoardStore.Store>(() => ({
		items,
	}));
};
