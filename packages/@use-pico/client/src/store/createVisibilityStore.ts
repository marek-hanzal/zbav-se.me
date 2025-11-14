import { create, type StoreApi, type UseBoundStore } from "zustand";

export namespace createVisibilityStore {
	export interface Props {
		defaultVisible?: boolean;
		defaultTopProximity?: boolean;
		defaultBottomProximity?: boolean;
	}

	export interface Store {
		visible: boolean;
		topProximity: boolean;
		bottomProximity: boolean;
		//
		setVisible(visible: boolean): void;
		setTopProximity(topProximity: boolean): void;
		setBottomProximity(bottomProximity: boolean): void;
		//
		/**
		 * Any visibility flag is true
		 */
		isVisible: boolean;
	}

	export type Hook = UseBoundStore<StoreApi<Store>>;
}

export const createVisibilityStore = ({
	defaultVisible = false,
	defaultTopProximity = false,
	defaultBottomProximity = false,
}: createVisibilityStore.Props): createVisibilityStore.Hook => {
	return create<createVisibilityStore.Store>((set) => ({
		visible: defaultVisible,
		topProximity: defaultTopProximity,
		bottomProximity: defaultBottomProximity,
		//
		setVisible(visible: boolean) {
			set((prev) => ({
				visible: visible,
				isVisible: visible || prev.topProximity || prev.bottomProximity,
			}));
		},
		setTopProximity(topProximity: boolean) {
			set((prev) => ({
				topProximity: topProximity,
				isVisible: prev.visible || topProximity || prev.bottomProximity,
			}));
		},
		setBottomProximity(bottomProximity: boolean) {
			set((prev) => ({
				bottomProximity: bottomProximity,
				isVisible: prev.visible || prev.topProximity || bottomProximity,
			}));
		},
		//
		isVisible: defaultVisible || defaultTopProximity || defaultBottomProximity,
	}));
};
