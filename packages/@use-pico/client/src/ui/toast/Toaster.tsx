import { type Cls, useCls } from "@use-pico/cls";
import { type FC, useId, useMemo, useRef } from "react";
import { anim, useAnim } from "../../gsap/gsap";
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

	const isBottom = useMemo(
		() =>
			[
				"bottom-left",
				"bottom-center",
				"bottom-right",
			].includes(String(position)),
		[
			position,
		],
	);

	const visibleKey = useMemo(() => {
		return $store
			.getVisible(position)
			.map((toast) => toast.id)
			.join("-");
	}, [
		$store,
		position,
	]);

	useAnim(
		() => {
			anim.fromTo(
				".Toaster-Item",
				{
					opacity: 0,
					y: isBottom ? 12 : -12,
				},
				{
					opacity: 1,
					y: 0,
					duration: 0.22,
					ease: "power2.out",
					clearProps: "transform",
					stagger: 0.06,
				},
			);
		},
		{
			scope: rootRef,
			dependencies: [
				visibleKey,
			],
		},
	);

	// TODO - move to portal!

	return (
		<div
			ref={rootRef}
			className={slots.root()}
		>
			{$store.getVisible(position).map((toast, i) => {
				return (
					<div
						key={`${toastId}-${toast.id}-${i}`}
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
