import { type Cls, useCls } from "@use-pico/cls";
import { type FC, useId, useRef } from "react";
import { useAnim } from "../../gsap/gsap";
import { ToasterCls } from "./ToasterCls";
import { useToastContext } from "./useToastContext";

export namespace Toaster {
	export interface Props extends ToasterCls.Props {
		/**
		 * The position of the toaster
		 */
		position: Cls.VariantOf<ToasterCls, "position">;
	}
}

export const Toaster: FC<Toaster.Props> = ({
	position,
	cls = ToasterCls,
	tweak,
}) => {
	const rootRef = useRef<HTMLDivElement>(null);
	const toastId = useId();

	const { slots } = useCls(cls, tweak, {
		variant: {
			position,
		},
	});

	const useToastStore = useToastContext();
	const $store = useToastStore();
	const durationMs = $store.durationMs;

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
		<div
			ref={rootRef}
			className={slots.root()}
		>
			{$store.getVisible(position).map((toast) => {
				return (
					<div
						key={`${toastId}-${toast.id}`}
						className={slots.item()}
						data-toast-id={toast.id}
					>
						{toast.render({
							store: $store,
							toast,
						})}
					</div>
				);
			})}
		</div>
	);
};
