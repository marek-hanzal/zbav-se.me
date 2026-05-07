import { create } from "zustand";
import type { createVisibilityStore } from "./createVisibilityStore";

const defaultState: createVisibilityStore.State = {
	visible: true,
	top: false,
	bottom: false,
	proximity: false,
	isVisible: true,
};

export const createNoopVisibilityStore = (): createVisibilityStore.Hook => {
	return create<createVisibilityStore.Store>(() => ({
		byId: new Map(),

		getById(_id) {
			return defaultState;
		},

		setVisible(_id, _visible) {
			// No-op
		},

		setTop(_id, _top) {
			// No-op
		},

		setBottom(_id, _bottom) {
			// No-op
		},

		removeById(_id) {
			// No-op
		},

		clear() {
			// No-op
		},
	}));
};
