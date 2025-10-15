import { Icon } from "@use-pico/client";
import { type FC, useRef } from "react";
import type { DialCls } from "~/app/ui/dial/DialCls";
import { anim, useAnim } from "~/app/ui/gsap";

export namespace Item {
	export interface Props extends DialCls.Props {
		icon: Icon.Type;
		disabled: boolean;
		onClick(): void;
		slots: DialCls.Slots;
	}
}

export const Item: FC<Item.Props> = ({ icon, disabled, onClick, slots }) => {
	const rootRef = useRef<HTMLDivElement>(null);

	const { contextSafe } = useAnim(
		() => {
			const tl = anim.timeline({
				defaults: {
					duration: 0.15,
				},
			});

			if (disabled) {
				tl.to(rootRef.current, {
					opacity: 0.45,
					scale: 0.9,
				}).to(rootRef.current, {
					opacity: 0.85,
					scale: 0.95,
				});
				return;
			}

			tl.to(rootRef.current, {
				opacity: 0.85,
				scale: 1.05,
			}).to(rootRef.current, {
				opacity: 1,
				scale: 1,
			});
		},
		{
			dependencies: [
				disabled,
			],
		},
	);

	const onClickSafe = contextSafe(() => {
		onClick();

		anim.timeline({
			defaults: {
				duration: 0.1,
			},
		})
			.to(rootRef.current, {
				opacity: 0.75,
				scale: 0.95,
			})
			.to(rootRef.current, {
				opacity: 1,
				scale: 1,
			});
	});

	return (
		<div
			ref={rootRef}
			className={slots.number({
				variant: {
					disabled,
				},
			})}
			onClick={onClickSafe}
		>
			<Icon
				icon={icon}
				tone={"secondary"}
				theme={"dark"}
			/>
		</div>
	);
};
