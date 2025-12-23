import { create, type StoreApi, type UseBoundStore } from "zustand";

export namespace createVisibilityStore {
	export interface State {
		/**
		 * True visible state (element is actually in viewport)
		 */
		visible: boolean;
		/**
		 * Proximity state (element is near viewport, above or below)
		 */
		proximity: boolean;
		/**
		 * Combined visibility state (visible || proximity)
		 */
		isVisible: boolean;
	}

	export interface Store {
		// Internal storage
		byId: Map<string, State>;

		// Read
		getById(id: string): State | undefined;

		// Write (business logic lives here)
		setVisible(id: string, visible: boolean): void;
		setProximity(id: string, proximity: boolean): void;

		// Lifecycle
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

		setVisible(id, visible) {
			set((prev) => {
				const next = new Map(prev.byId);

				const current = next.get(id) ?? {
					visible: false,
					proximity: false,
					isVisible: false,
				};

				const state = {
					visible: visible,
					proximity: current.proximity,
					isVisible: visible || current.proximity,
				};

				next.set(id, state);
				return {
					byId: next,
				};
			});
		},

		setProximity(id, proximity) {
			set((prev) => {
				const next = new Map(prev.byId);

				const current = next.get(id) ?? {
					visible: false,
					proximity: false,
					isVisible: false,
				};

				const state = {
					visible: current.visible,
					proximity: proximity,
					isVisible: current.visible || proximity,
				};

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
