import type { Cls } from "@use-pico/cls";
import { create, type StoreApi, type UseBoundStore } from "zustand";
import type { Toast } from "./Toast";
import type { ToasterCls } from "./ToasterCls";

export namespace createToastStore {
	export interface Props {
		maxCount: number;
		gap: number;
		offset: number;
		durationMs: number;
	}

	export interface Store {
		maxCount: number;
		//
		gap: number;
		offset: number;
		//
		durationMs: number;
		//
		toasts: Toast[];
		//
		visible: Toast[];
		queue: Toast[];
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
		/**
		 * Dismisses a toast by its identifier.
		 * @param id - Identifier of the toast to dismiss.
		 */
		dismiss(id: string): void;
		//
		/**
		 * Resolves the currently visible toast payloads.
		 * @returns Ordered collection of visible toast instances.
		 */
		getVisible(position: Cls.VariantOf<ToasterCls, "position">): Toast[];
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
	gap,
	offset,
	durationMs,
}: createToastStore.Props): createToastStore.Hook => {
	return create<createToastStore.Store>((set, get) => ({
		maxCount,
		//
		gap,
		offset,
		//
		durationMs,
		//
		toasts: [],
		//
		visible: [],
		queue: [],
		//
		toast(toast) {
			set((state) => {
				return {
					toasts: [
						...state.toasts,
						toast,
					],
				};
			});
		},
		//
		send(id) {
			set((state) => {
				const toast = state.toasts.findLast((t) => t.id === id);

				if (!toast) {
					return state;
				}

				if (state.visible.length < state.maxCount) {
					return {
						visible: [
							...state.visible,
							toast,
						],
					};
				}
				return {
					queue: [
						...state.queue,
						toast,
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
		dismiss(id) {
			set((state) => ({
				toasts: state.toasts.filter((t) => t.id !== id),
				queue: state.queue.filter((t) => t.id !== id),
				visible: state.visible.filter((t) => t.id !== id),
			}));
		},
		//
		getVisible(position) {
			const current = get();

			return (
				[
					"bottom-center",
					"bottom-left",
					"bottom-right",
				] as (typeof position)[]
			).includes(position)
				? current.visible.reverse()
				: current.visible;
		},
		//
		getQueue() {
			return get().queue;
		},
	}));
};
