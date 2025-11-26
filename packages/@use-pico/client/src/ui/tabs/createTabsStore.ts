import { create, type StoreApi, type UseBoundStore } from "zustand";

export namespace createTabsStore {
	export interface Props {
		tab: string | undefined;
		hidden: string[];
	}

	export interface Store {
		tab: string | undefined;
		hidden: string[];
		setCurrent(current: string): void;
	}

	export type UseStore = UseBoundStore<StoreApi<Store>>;
}

export const createTabsStore = ({
	tab,
	hidden,
}: createTabsStore.Props): createTabsStore.UseStore => {
	return create((set) => ({
		tab,
		hidden,
		setCurrent: (tab: string) => {
			set({
				tab,
			});
		},
	}));
};
