import { create } from "zustand";
import type { createVisibilityStoreFn } from "~/visibility/fn/createVisibilityStoreFn";

const defaultState: createVisibilityStoreFn.State = {
	visible: true,
	top: false,
	bottom: false,
	proximity: false,
	isVisible: true,
};

export const createNoopVisibilityStoreFn = (): createVisibilityStoreFn.Hook => {
	return create<createVisibilityStoreFn.Store>(() => ({
		byId: new Map(),

		getByIdFn(_id) {
			return defaultState;
		},

		setVisibleFn(_id, _visible) {
			// No-op
		},

		setTopFn(_id, _top) {
			// No-op
		},

		setBottomFn(_id, _bottom) {
			// No-op
		},

		removeByIdFn(_id) {
			// No-op
		},

		clearFn() {
			// No-op
		},
	}));
};
