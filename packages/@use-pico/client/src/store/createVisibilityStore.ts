import { create, type StoreApi, type UseBoundStore } from "zustand";

export namespace createVisibilityStore {
	export interface State {
		visible: boolean;
		isVisible: boolean;
		top: boolean;
		bottom: boolean;
	}

	export interface Store {
		// Internal
		byId: Map<string, State>;

		// API
		getById(id: string): State | undefined;
		setById(id: string, state: State): void;
		removeById(id: string): void;
		clear(): void;
	}

	export type Hook = UseBoundStore<StoreApi<Store>>;
}

export const createVisibilityStore = (): createVisibilityStore.Hook => {
	return create<createVisibilityStore.Store>((set, get) => ({
		byId: new Map(),

		getById(id) {
			return get().byId.get(id);
		},

		setById(id, state) {
			set((prev) => {
				const next = new Map(prev.byId);
				next.set(id, state);
				return {
					byId: next,
				};
			});
		},

		removeById(id) {
			set((prev) => {
				if (!prev.byId.has(id)) {
					return prev;
				}
				const next = new Map(prev.byId);
				next.delete(id);
				return {
					byId: next,
				};
			});
		},

		clear() {
			set({
				byId: new Map(),
			});
		},
	}));
};
