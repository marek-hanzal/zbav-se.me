import { create, type StoreApi, type UseBoundStore } from "zustand";

export namespace createVisibilityStoreFn {
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
		getByIdFn(id: string): State | undefined;

		// Write (business logic lives here)
		setVisibleFn(id: string, visible: boolean): void;
		setTopFn(id: string, top: boolean): void;
		setBottomFn(id: string, bottom: boolean): void;

		// Lifecycle
		removeByIdFn(id: string): void;
		clearFn(): void;
	}

	export type Hook = UseBoundStore<StoreApi<Store>>;
}

function deriveFn(
	next: Pick<createVisibilityStoreFn.State, "visible" | "top" | "bottom">,
): Pick<createVisibilityStoreFn.State, "proximity" | "isVisible"> {
	const proximity = next.top || next.bottom;
	return {
		proximity,
		isVisible: next.visible || proximity,
	};
}

export const createVisibilityStoreFn = (): createVisibilityStoreFn.Hook => {
	return create<createVisibilityStoreFn.Store>((setFn, getFn) => ({
		byId: new Map(),

		getByIdFn(id) {
			return getFn().byId.get(id);
		},

		setVisibleFn(id, visible) {
			setFn((prev) => {
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
					...deriveFn(base),
				});

				return {
					byId: next,
				};
			});
		},

		setTopFn(id, top) {
			setFn((prev) => {
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
					...deriveFn(base),
				});

				return {
					byId: next,
				};
			});
		},

		setBottomFn(id, bottom) {
			setFn((prev) => {
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
					...deriveFn(base),
				});

				return {
					byId: next,
				};
			});
		},

		removeByIdFn(id) {
			setFn((prev) => {
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

		clearFn() {
			setFn({
				byId: new Map(),
			});
		},
	}));
};
