import { create, type StoreApi, type UseBoundStore } from "zustand";

export namespace createVisibilityStore {
	export interface State {
		/**
		 * True visible state (element is actually in viewport)
		 */
		visible: boolean;

		/**
		 * Top proximity flag (element is above viewport in overscan zone)
		 */
		top: boolean;

		/**
		 * Bottom proximity flag (element is below viewport in overscan zone)
		 */
		bottom: boolean;

		/**
		 * Proximity state (derived): top || bottom
		 */
		proximity: boolean;

		/**
		 * Combined visibility state (derived): visible || proximity
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
		setTop(id: string, top: boolean): void;
		setBottom(id: string, bottom: boolean): void;

		// Lifecycle
		removeById(id: string): void;
		clear(): void;
	}

	export type Hook = UseBoundStore<StoreApi<Store>>;
}

function derive(
	next: Pick<createVisibilityStore.State, "visible" | "top" | "bottom">,
): Pick<createVisibilityStore.State, "proximity" | "isVisible"> {
	const proximity = next.top || next.bottom;
	return {
		proximity,
		isVisible: next.visible || proximity,
	};
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
					top: false,
					bottom: false,
					proximity: false,
					isVisible: false,
				};

				const base = {
					visible,
					top: current.top,
					bottom: current.bottom,
				};

				next.set(id, {
					...current,
					...base,
					...derive(base),
				});

				return {
					byId: next,
				};
			});
		},

		setTop(id, top) {
			set((prev) => {
				const next = new Map(prev.byId);

				const current = next.get(id) ?? {
					visible: false,
					top: false,
					bottom: false,
					proximity: false,
					isVisible: false,
				};

				const base = {
					visible: current.visible,
					top,
					bottom: current.bottom,
				};

				next.set(id, {
					...current,
					...base,
					...derive(base),
				});

				return {
					byId: next,
				};
			});
		},

		setBottom(id, bottom) {
			set((prev) => {
				const next = new Map(prev.byId);

				const current = next.get(id) ?? {
					visible: false,
					top: false,
					bottom: false,
					proximity: false,
					isVisible: false,
				};

				const base = {
					visible: current.visible,
					top: current.top,
					bottom,
				};

				next.set(id, {
					...current,
					...base,
					...derive(base),
				});

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
