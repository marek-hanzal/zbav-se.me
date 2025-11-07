import { create, type StoreApi, type UseBoundStore } from "zustand";
import type { Toast } from "./Toast";

export namespace createToastStore {
	export interface Props {
		maxCount: number;
		delayMs: number;
	}

	export interface Store {
		maxCount: number;
		delayMs: number;
		//
		toasts: Record<string, Toast>;
		//
		visible: string[];
		queue: string[];
		//
		/**
		 * Registers or updates a toast instance within the store.
		 * @param toast - Toast payload to persist by its `id`.
		 */
		toast(toast: Toast): void;
		//
		/**
		 * Moves a toast into the visible list or queues it if the visible limit is reached.
		 * @param id - Identifier of the toast to display.
		 */
		send(id: string): void;
		//
		/**
		 * Promotes the next queued toast into the visible list when space is available.
		 */
		pull(): void;
		//
		/**
		 * Removes a toast from the queue without affecting visibility.
		 * @param id - Identifier of the toast to remove.
		 */
		removeFromQueue(id: string): void;
		/**
		 * Removes a toast from the visible list without affecting the queue.
		 * @param id - Identifier of the toast to hide.
		 */
		removeFromVisible(id: string): void;
		//
		/**
		 * Resolves the currently visible toast payloads.
		 * @returns Ordered collection of visible toast instances.
		 */
		getVisible(): Toast[];
		/**
		 * Resolves the currently queued toast payloads.
		 * @returns Ordered collection of queued toast instances.
		 */
		getQueue(): Toast[];
	}

	export type Hook = UseBoundStore<StoreApi<Store>>;
}

export const createToastStore = ({
	maxCount,
	delayMs,
}: createToastStore.Props): createToastStore.Hook => {
	return create<createToastStore.Store>((set, get) => ({
		maxCount,
		delayMs,
		//
		toasts: {},
		//
		visible: [],
		queue: [],
		//
		toast(toast) {
			set((state) => {
				return {
					toasts: {
						...state.toasts,
						[toast.id]: toast,
					},
					queue: [
						...state.queue,
						toast.id,
					],
				};
			});
		},
		//
		send(id) {
			set((state) => {
				if (state.visible.length < state.maxCount) {
					return {
						visible: [
							...state.visible,
							id,
						],
					};
				}
				return {
					queue: [
						...state.queue,
						id,
					],
				};
			});
		},
		//
		pull() {
			set((state) => {
				if (
					state.queue.length > 0 &&
					state.visible.length < state.maxCount
				) {
					return {
						visible: [
							...state.visible,
							// biome-ignore lint/style/noNonNullAssertion: We've check in the condition
							state.queue[0]!,
						],
						queue: state.queue.slice(1),
					};
				}

				return state;
			});
		},
		//
		removeFromQueue(id) {
			set((state) => ({
				queue: state.queue.filter((t) => t !== id),
			}));
		},
		//
		removeFromVisible(id) {
			set((state) => ({
				visible: state.visible.filter((t) => t !== id),
			}));
		},
		//
		getVisible() {
			const current = get();
			return current.visible
				.map((id) => current.toasts[id])
				.filter((t) => t !== undefined);
		},
		//
		getQueue() {
			const current = get();
			return current.queue
				.map((id) => current.toasts[id])
				.filter((t) => t !== undefined);
		},
	}));
};
