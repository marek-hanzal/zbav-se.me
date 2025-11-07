import { type FC, useId, useRef } from "react";
import { useAnim } from "../../gsap/gsap";
import { useToastContext } from "./useToastContext";

export namespace Toaster {
	export type Position =
		| "top-right"
		| "top-center"
		| "top-left"
		| "bottom-right"
		| "bottom-center"
		| "bottom-left";

	export interface Props {
		/**
		 * The position of the toaster
		 */
		position: Position;
	}
}

export const Toaster: FC<Toaster.Props> = ({ position }) => {
	const rootRef = useRef<HTMLDivElement>(null);

	const useToastStore = useToastContext();
	const $store = useToastStore();
	const getVisible = useToastStore((store) => store.getVisible);
	/**
	 * Promotes the next queued toast into the visible list when space is available.
	 */
	const pull = useToastStore((store) => store.pull);
	/**
	 * The delay in milliseconds before a toast is removed.
	 */
	const delayMs = useToastStore((store) => store.delayMs);
	const toastId = useId();

	useAnim(
		() => {
			//
		},
		{
			scope: rootRef,
			dependencies: [],
		},
	);

	return (
		<div ref={rootRef}>
			{getVisible().map((toast) => {
				return toast.render({
					store: $store,
					toastId,
					toast,
				});
			})}
		</div>
	);
};
